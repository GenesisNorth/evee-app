import { useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { ChevronRight, LoaderCircle } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const uses = [
  { id: "daily_commute", label: "Daily commute", hint: "City driving" },
  { id: "family", label: "Family trips", hint: "Weekends & school runs" },
  { id: "business", label: "Business fleet", hint: "Executive & sales" },
  { id: "ride_hail", label: "Ride-hail / e-hailing", hint: "Uber, Bolt, InDrive" },
];
const bodyTypes = ["sedan", "suv", "hatchback", "pickup", "van"];
const interestOptions = ["finance", "charge", "service", "learn", "connect"];
const budgets = [
  { min: 20000, max: 30000, label: "$20k — $30k" },
  { min: 30000, max: 45000, label: "$30k — $45k" },
  { min: 45000, max: 70000, label: "$45k — $70k" },
  { min: 70000, max: 200000, label: "$70k+" },
];
const steps = ["About you", "How you drive", "Your budget", "What interests you"];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [primaryUse, setPrimaryUse] = useState("daily_commute");
  const [budget, setBudget] = useState(budgets[1]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(["suv"]);
  const [minRange, setMinRange] = useState(350);
  const [interests, setInterests] = useState<string[]>(["finance", "charge"]);
  const [saving, setSaving] = useState(false);

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function finish() {
    if (!user) return;
    setSaving(true);
    try {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName || user.email?.split("@")[0],
        city,
        country,
        onboarded: true,
      });
      if (profileError) throw profileError;
      const { error: prefsError } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        primary_use: primaryUse,
        budget_min: budget.min,
        budget_max: budget.max,
        body_types: selectedBodyTypes,
        min_range_km: minRange,
        interests,
      });
      if (prefsError) throw prefsError;
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      Toast.show({ type: "success", text1: "You're all set" });
    } catch (e) {
      Toast.show({ type: "error", text1: e instanceof Error ? e.message : "Could not save" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingTop: Math.max(insets.top, 40), paddingBottom: insets.bottom + 24 }}
        className="px-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="flex-row items-center gap-2">
          {steps.map((_, i) => (
            <View key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-lime" : "bg-white/[0.08]")} />
          ))}
        </View>
        <Text className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Step {step + 1} of {steps.length}
        </Text>
        <Text className="mt-1 font-display-black text-2xl text-foreground">{steps[step]}</Text>

        <View className="mt-6 gap-4">
          {step === 0 && (
            <>
              <Field label="Full name">
                <Input value={fullName} onChangeText={setFullName} placeholder="Your name" />
              </Field>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Field label="City">
                    <Input value={city} onChangeText={setCity} placeholder="Lagos" />
                  </Field>
                </View>
                <View className="flex-1">
                  <Field label="Country">
                    <Input value={country} onChangeText={setCountry} placeholder="Nigeria" />
                  </Field>
                </View>
              </View>
            </>
          )}

          {step === 1 && (
            <>
              <View className="gap-2">
                {uses.map((u) => (
                  <OptionCard
                    key={u.id}
                    active={primaryUse === u.id}
                    onPress={() => setPrimaryUse(u.id)}
                    label={u.label}
                    hint={u.hint}
                  />
                ))}
              </View>
              <View>
                <Label className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Body type (pick any)
                </Label>
                <View className="flex-row flex-wrap gap-2">
                  {bodyTypes.map((b) => (
                    <Chip key={b} active={selectedBodyTypes.includes(b)} onPress={() => toggle(selectedBodyTypes, b, setSelectedBodyTypes)}>
                      {b}
                    </Chip>
                  ))}
                </View>
              </View>
              <View>
                <Label className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Minimum range: <Text className="text-foreground">{minRange} km</Text>
                </Label>
                <Slider
                  minimumValue={200}
                  maximumValue={600}
                  step={25}
                  value={minRange}
                  onValueChange={setMinRange}
                  minimumTrackTintColor="#b3f835"
                  maximumTrackTintColor="rgba(255,255,255,0.15)"
                  thumbTintColor="#b3f835"
                />
              </View>
            </>
          )}

          {step === 2 && (
            <View className="gap-2">
              {budgets.map((b) => (
                <OptionCard
                  key={b.label}
                  active={budget.label === b.label}
                  onPress={() => setBudget(b)}
                  label={b.label}
                  hint="USD, purchase price"
                />
              ))}
            </View>
          )}

          {step === 3 && (
            <View className="flex-row flex-wrap gap-2">
              {interestOptions.map((i) => (
                <Chip key={i} active={interests.includes(i)} onPress={() => toggle(interests, i, setInterests)}>
                  {i}
                </Chip>
              ))}
            </View>
          )}
        </View>

        <View className="pt-6">
          <Button
            disabled={saving}
            onPress={() => (step < steps.length - 1 ? setStep(step + 1) : finish())}
            className="h-12 w-full rounded-xl"
          >
            {saving && <LoaderCircle size={16} color="#060606" />}
            <Text className="text-sm font-semibold text-primary-foreground">
              {step < steps.length - 1 ? "Continue" : "Finish setup"}
            </Text>
            {!saving && <ChevronRight size={16} color="#060606" />}
          </Button>
          {step > 0 && (
            <Pressable onPress={() => setStep(step - 1)} className="mt-3 items-center">
              <Text className="text-xs text-muted-foreground">Back</Text>
            </Pressable>
          )}
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

function OptionCard({
  active,
  onPress,
  label,
  hint,
}: {
  active: boolean;
  onPress: () => void;
  label: string;
  hint: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-between rounded-2xl border border-white/[0.06] bg-card px-4 py-3.5",
        active && "border-primary/60 bg-primary/10",
      )}
    >
      <View>
        <Text className="font-display text-sm text-foreground">{label}</Text>
        <Text className="mt-0.5 text-[11px] text-muted-foreground">{hint}</Text>
      </View>
      <View className={cn("h-4 w-4 rounded-full border-2", active ? "border-primary bg-primary" : "border-white/25")} />
    </Pressable>
  );
}

function Chip({ active, onPress, children }: { active: boolean; onPress: () => void; children: string }) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "rounded-full border px-4 py-2",
        active ? "border-primary/60 bg-primary/15" : "border-white/10 bg-white/[0.03]",
      )}
    >
      <Text className={cn("text-xs font-semibold capitalize", active ? "text-lime" : "text-muted-foreground")}>
        {children}
      </Text>
    </Pressable>
  );
}
