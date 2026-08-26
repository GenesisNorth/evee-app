import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Wallet } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { formatCurrency } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import type { FinancingApplication, InsuranceQuote } from "@/lib/types";

export default function ActivityScreen() {
  const { user } = useSession();

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

  const { data: insurance } = useQuery({
    enabled: !!user,
    queryKey: ["ins", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("insurance_quotes")
        .select("*, vehicle:vehicles(make, model)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return (data ?? []) as unknown as InsuranceQuote[];
    },
  });

  const empty = (!financing || financing.length === 0) && (!insurance || insurance.length === 0);

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Activity" subtitle="Applications, quotes & bookings" showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-5">
        <View className="gap-5">
          {empty && (
            <View className="rounded-2xl border border-white/[0.06] bg-card p-6">
              <Text className="text-center text-sm text-muted-foreground">
                Nothing here yet. Apply for financing or an insurance plan to get started.
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
                {financing.map((f) => (
                  <View key={f.id} className="flex-row items-start justify-between rounded-2xl border border-white/[0.06] bg-card p-4">
                    <View>
                      <Text className="font-display-black text-sm text-foreground">
                        {f.vehicle?.make} {f.vehicle?.model}
                      </Text>
                      <Text className="mt-0.5 text-[11px] text-muted-foreground">
                        {f.term_months} mo · {formatCurrency(Number(f.estimated_monthly))}/mo
                      </Text>
                    </View>
                    <View className="rounded-full bg-primary/15 px-2 py-0.5">
                      <Text className="text-[10px] uppercase text-lime">{f.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {insurance && insurance.length > 0 && (
            <View>
              <View className="mb-2 flex-row items-center gap-2">
                <ShieldCheck size={14} color="#9b9fa3" />
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Insurance</Text>
              </View>
              <View className="gap-2">
                {insurance.map((q) => (
                  <View key={q.id} className="flex-row items-start justify-between rounded-2xl border border-white/[0.06] bg-card p-4">
                    <View>
                      <Text className="font-display-black text-sm text-foreground">
                        {q.vehicle?.make} {q.vehicle?.model}
                      </Text>
                      <Text className="mt-0.5 text-[11px] text-muted-foreground">
                        {q.provider} · {q.plan_tier} · {formatCurrency(Number(q.annual_premium))}/yr
                      </Text>
                    </View>
                    <View className="rounded-full bg-primary/15 px-2 py-0.5">
                      <Text className="text-[10px] uppercase text-lime">{q.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
