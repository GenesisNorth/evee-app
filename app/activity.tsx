import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { Wallet, Clock, CheckCircle, Calendar } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import type { FinancingApplication } from "@/lib/types";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ActivityScreen() {
  const { user } = useSession();
  const router = useRouter();

  const { data: financing } = useQuery({
    enabled: !!user,
    queryKey: ["fin", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("financing_applications")
        .select("*, vehicle:vehicles(make, model)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return (data ?? []) as unknown as FinancingApplication[];
    },
  });

  const empty = !financing || financing.length === 0;

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Activity" subtitle="Applications, quotes & bookings" showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-5">
        <View className="gap-5">
          {empty && (
            <View className="rounded-2xl border border-white/[0.06] bg-card p-6">
              <Text className="text-center text-sm text-muted-foreground">
                Nothing here yet. Apply for financing to get started.
              </Text>
            </View>
          )}

          {financing && financing.length > 0 && (
            <View>
              <View className="mb-2 flex-row items-center gap-2">
                <Wallet size={14} color="#9b9fa3" />
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Financing</Text>
              </View>
              <View className="gap-2">
                {financing.map((f, index) => {
                  const isApproved = f.status === "approved";
                  const isDeclined = f.status === "declined";
                  const isPending = !isApproved && !isDeclined;

                  return (
                    <Animated.View 
                      key={f.id} 
                      entering={FadeInDown.delay(index * 150).springify()}
                      className="gap-3 rounded-2xl border border-white/[0.06] bg-card p-4"
                    >
                      <View className="flex-row items-start justify-between">
                        <View>
                          <Text className="font-display-black text-sm text-foreground">
                            {f.vehicle?.make} {f.vehicle?.model}
                          </Text>
                          <Text className="mt-0.5 text-[11px] text-muted-foreground">
                            {f.term_months} mo · {formatCurrency(Number(f.estimated_monthly))}/mo
                          </Text>
                        </View>
                        <View className={cn("rounded-full px-2 py-0.5 flex-row items-center gap-1", 
                          isApproved ? "bg-lime/20" : isDeclined ? "bg-red-500/20" : "bg-amber-500/20"
                        )}>
                          {isApproved ? <CheckCircle size={10} color="#b3f835" /> : <Clock size={10} color={isDeclined ? "#ef4444" : "#f59e0b"} />}
                          <Text className={cn("text-[10px] uppercase font-semibold", 
                            isApproved ? "text-lime" : isDeclined ? "text-red-500" : "text-amber-500"
                          )}>
                            {isApproved ? "Approved" : isDeclined ? "Declined" : "Under Review"}
                          </Text>
                        </View>
                      </View>
                      
                      {isPending && (
                        <View className="mt-2 flex-row items-center gap-2 rounded-xl bg-white/[0.03] p-3">
                          <Clock size={14} color="#9b9fa3" />
                          <Text className="flex-1 text-xs text-muted-foreground">Bank review in progress. Expect an update within 24-48 hrs.</Text>
                        </View>
                      )}

                      {isApproved && (
                        <View className="mt-2 border-t border-white/[0.06] pt-4">
                          <View className="mb-4">
                            <Pressable onPress={() => router.push(`/delivery/${f.vehicle_id}`)} className="flex-row items-center justify-between rounded-xl border border-primary/40 bg-primary/10 p-3">
                              <View>
                                <Text className="font-display-black text-sm text-lime">Vehicle Ready</Text>
                                <Text className="text-[11px] text-muted-foreground mt-0.5">Schedule your delivery/pickup now</Text>
                              </View>
                              <View className="rounded-full bg-lime px-3 py-1.5">
                                <Text className="text-[10px] font-semibold text-primary-foreground uppercase">Schedule</Text>
                              </View>
                            </Pressable>
                          </View>
                          
                          <View className="flex-row justify-between mb-2">
                            <Text className="text-xs text-muted-foreground">Repayment Progress</Text>
                            <Text className="text-xs font-semibold text-foreground">2 / {f.term_months} Paid</Text>
                          </View>
                          <View className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <View className="h-full bg-lime" style={{ width: `${(2 / f.term_months) * 100}%` }} />
                          </View>
                          <View className="mt-4 flex-row items-center justify-between rounded-xl bg-primary/10 p-3">
                            <View className="flex-row items-center gap-2">
                              <Calendar size={14} color="#b3f835" />
                              <Text className="text-xs font-medium text-foreground">Next: Oct 15</Text>
                            </View>
                            <View className="rounded-lg bg-lime px-3 py-1.5">
                              <Text className="text-xs font-semibold text-primary-foreground">Pay {formatCurrency(Number(f.estimated_monthly))}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}
