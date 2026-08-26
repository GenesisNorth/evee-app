import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Check, LoaderCircle, ShieldCheck } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { formatCurrency } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

const providers = [
  { key: "old-mutual", name: "Old Mutual Insure" },
  { key: "leadway", name: "Leadway Assurance" },
  { key: "britam", name: "Britam" },
];

function plansFor(price: number) {
  return [
    { tier: "basic", label: "Basic", price: price * 0.03, features: ["Third-party liability", "Roadside assistance"] },
    { tier: "standard", label: "Standard", price: price * 0.05, features: ["Comprehensive cover", "Battery protection", "Roadside assistance"] },
    { tier: "premium", label: "Premium", price: price * 0.07, features: ["Comprehensive cover", "Battery + charger cover", "Courtesy vehicle", "24/7 concierge"] },
  ];
}

export default function InsureScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { user } = useSession();
  const router = useRouter();
  const [provider, setProvider] = useState(providers[0]);
  const [planIndex, setPlanIndex] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { data: vehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => (await supabase.from("vehicles").select("*").eq("id", vehicleId!).maybeSingle()).data as Vehicle | null,
  });

  const plans = useMemo(() => (vehicle ? plansFor(Number(vehicle.price)) : []), [vehicle]);
  const plan = plans[planIndex];

  async function selectPlan() {
    if (!user || !vehicle || !plan) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("insurance_quotes").insert({
        user_id: user.id,
        vehicle_id: vehicle.id,
        provider: provider.name,
        plan_tier: plan.tier,
        annual_premium: plan.price,
        coverage: { features: plan.features },
        status: "selected",
      });
      if (error) throw error;
      Toast.show({ type: "success", text1: "Insurance plan selected" });
      router.push("/activity");
    } catch (e) {
      Toast.show({ type: "error", text1: e instanceof Error ? e.message : "Failed" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Insurance" subtitle={vehicle ? `${vehicle.make} ${vehicle.model}` : undefined} showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-5">
        <View className="gap-5">
          <View>
            <Text className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Provider</Text>
            <View className="flex-row flex-wrap gap-2">
              {providers.map((p) => (
                <Pressable
                  key={p.key}
                  onPress={() => setProvider(p)}
                  className={cn("rounded-full border px-3.5 py-1.5", provider.key === p.key ? "border-primary/60 bg-primary/15" : "border-white/10 bg-white/[0.03]")}
                >
                  <Text className={cn("text-xs font-semibold", provider.key === p.key ? "text-lime" : "text-muted-foreground")}>{p.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-3">
            {plans.map((p, i) => (
              <Pressable
                key={p.tier}
                onPress={() => setPlanIndex(i)}
                className={cn("rounded-2xl border border-white/[0.06] bg-card p-4", planIndex === i && "border-primary/60 bg-primary/5")}
              >
                <View className="flex-row items-start justify-between">
                  <View>
                    <Text className="text-[10px] uppercase tracking-widest text-lime">{p.label}</Text>
                    <Text className="mt-1 font-display-black text-xl text-foreground">
                      {formatCurrency(p.price)} <Text className="text-[10px] font-medium text-muted-foreground">/yr</Text>
                    </Text>
                  </View>
                  <View
                    className={cn(
                      "h-6 w-6 items-center justify-center rounded-full border-2",
                      planIndex === i ? "border-primary bg-primary" : "border-white/25",
                    )}
                  >
                    {planIndex === i && <Check size={12} color="#060606" strokeWidth={3} />}
                  </View>
                </View>
                <View className="mt-3 gap-1">
                  {p.features.map((f) => (
                    <View key={f} className="flex-row items-start gap-1.5">
                      <ShieldCheck size={12} color="#b3f835" />
                      <Text className="flex-1 text-[12px] text-muted-foreground">{f}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            ))}
          </View>

          <Button disabled={submitting || !vehicle} onPress={selectPlan} className="h-12 w-full rounded-xl">
            {submitting && <LoaderCircle size={16} color="#060606" />}
            <Text className="text-sm font-semibold text-primary-foreground">Select plan</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
