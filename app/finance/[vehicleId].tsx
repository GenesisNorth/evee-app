import { useMemo, useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, LoaderCircle } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { formatCurrency, monthlyPayment } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

const employmentOptions = ["Full-time", "Self-employed", "Business owner", "Contract"];
const termOptions = [24, 36, 48, 60, 72];
const planOptions = ["Standard", "2-Part", "3-Part", "4-Part"];

export default function FinanceScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { user } = useSession();
  const router = useRouter();

  const { data: vehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => (await supabase.from("vehicles").select("*").eq("id", vehicleId!).maybeSingle()).data as Vehicle | null,
  });

  const [downPayment, setDownPayment] = useState(5000);
  const [term, setTerm] = useState(60);
  const [income, setIncome] = useState(2500);
  const [employment, setEmployment] = useState(employmentOptions[0]);
  const [planType, setPlanType] = useState(planOptions[0]);
  const [submitting, setSubmitting] = useState(false);

  const estMonthly = useMemo(() => {
    if (!vehicle) return 0;
    if (planType === "Standard") return monthlyPayment(Number(vehicle.price), downPayment, term);
    if (planType === "2-Part") return Number(vehicle.price) / 2;
    if (planType === "3-Part") return Number(vehicle.price) / 3;
    if (planType === "4-Part") return Number(vehicle.price) / 4;
    return 0;
  }, [vehicle, downPayment, term, planType]);

  const upfrontCost = planType === "Standard" ? downPayment : estMonthly;
  const incomeRatio = income > 0 ? (estMonthly / income) * 100 : 0;
  const isEligible = incomeRatio <= 30;

  async function submit() {
    if (!user || !vehicle) return;
    if (downPayment > Number(vehicle.price)) {
      Toast.show({ type: "error", text1: "Down payment exceeds price" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("financing_applications").insert({
        user_id: user.id,
        vehicle_id: vehicle.id,
        down_payment: upfrontCost,
        term_months: planType === "Standard" ? term : parseInt(planType.split("-")[0]),
        monthly_income: income,
        employment_status: employment,
        estimated_monthly: estMonthly,
        status: isEligible ? "pre_approved" : "submitted",
      });
      if (error) throw error;
      Toast.show({ type: "success", text1: "Application submitted — we'll be in touch" });
      router.push("/activity");
    } catch (e) {
      Toast.show({ type: "error", text1: e instanceof Error ? e.message : "Failed to submit" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <PageHeader title="Financing" subtitle={vehicle ? `${vehicle.make} ${vehicle.model}` : undefined} showBack />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="gap-5 px-5"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="gap-5">
          <View>
            <Label className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Payment Plan</Label>
            <View className="flex-row flex-wrap gap-2">
              {planOptions.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPlanType(p)}
                  className={cn("rounded-full border px-4 py-1.5", planType === p ? "border-primary/60 bg-primary/15" : "border-white/10 bg-white/[0.03]")}
                >
                  <Text className={cn("text-xs font-semibold", planType === p ? "text-lime" : "text-muted-foreground")}>{p}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="rounded-2xl border border-white/[0.06] bg-card p-4">
            <Text className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {planType === "Standard" ? "Estimated monthly" : "Per Payment"}
            </Text>
            <Text className="mt-1 font-display-black text-3xl text-lime">{formatCurrency(estMonthly)}</Text>
            <Text className="mt-1 text-[11px] text-muted-foreground">
              {vehicle 
                ? planType === "Standard" 
                  ? `on ${formatCurrency(Number(vehicle.price))} · ${term} months · ~15% APR`
                  : `Total: ${formatCurrency(Number(vehicle.price))} · ${planType.split("-")[0]} equal payments`
                : "—"}
            </Text>
          </View>

          {planType === "Standard" && (
            <>
              <Field label="Down payment">
                <Input keyboardType="numeric" value={String(downPayment)} onChangeText={(t) => setDownPayment(Number(t) || 0)} />
              </Field>

              <View>
                <Label className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Term</Label>
                <View className="flex-row flex-wrap gap-2">
                  {termOptions.map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setTerm(t)}
                      className={cn("rounded-full border px-4 py-1.5", term === t ? "border-primary/60 bg-primary/15" : "border-white/10 bg-white/[0.03]")}
                    >
                      <Text className={cn("text-xs font-semibold", term === t ? "text-lime" : "text-muted-foreground")}>{t} mo</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}

          <Field label="Monthly income (USD)">
            <Input keyboardType="numeric" value={String(income)} onChangeText={(t) => setIncome(Number(t) || 0)} />
          </Field>

          <View>
            <Label className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Employment</Label>
            <View className="flex-row flex-wrap gap-2">
              {employmentOptions.map((e) => (
                <Pressable
                  key={e}
                  onPress={() => setEmployment(e)}
                  className={cn("rounded-full border px-4 py-1.5", employment === e ? "border-primary/60 bg-primary/15" : "border-white/10 bg-white/[0.03]")}
                >
                  <Text className={cn("text-xs font-semibold", employment === e ? "text-lime" : "text-muted-foreground")}>{e}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Eligibility Check Banner */}
          {income > 0 && estMonthly > 0 && (
            <View className={cn("mt-2 rounded-2xl border p-4 flex-row items-start gap-3", isEligible ? "bg-primary/10 border-primary/20" : "bg-amber-500/10 border-amber-500/20")}>
              {isEligible ? <CheckCircle size={20} color="#b3f835" /> : <AlertCircle size={20} color="#f59e0b" />}
              <View className="flex-1">
                <Text className={cn("font-display-black text-sm", isEligible ? "text-lime" : "text-amber-500")}>
                  {isEligible ? "Pre-qualified" : "Requires Manual Review"}
                </Text>
                <Text className="mt-0.5 text-xs text-muted-foreground">
                  {isEligible 
                    ? "Your income supports this payment plan perfectly."
                    : "This payment plan exceeds 30% of your stated monthly income. We may need extra details."}
                </Text>
              </View>
            </View>
          )}

          <Button disabled={submitting || !vehicle} onPress={submit} className="h-12 w-full rounded-xl">
            {submitting && <LoaderCircle size={16} color="#060606" />}
            <Text className="text-sm font-semibold text-primary-foreground">Submit application</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </View>
  );
}
