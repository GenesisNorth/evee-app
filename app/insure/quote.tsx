import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { CheckCircle2, ChevronLeft, Shield, CarFront, User, Briefcase, Zap, ShieldCheck } from "lucide-react-native";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from "react-native-reanimated";

const STEPS = ["Vehicle Usage", "Driver Profile", "Coverage Plan", "Your Quote"];

const USAGE_TYPES = [
  { id: "personal", title: "Personal Use", desc: "Commuting, errands, and pleasure.", icon: User },
  { id: "business", title: "Business / Rideshare", desc: "Uber, Bolt, or business deliveries.", icon: Briefcase },
];

const COVERAGE_LEVELS = [
  { id: "standard", title: "Standard Liability", desc: "Covers damages to others.", price: "₦65,000/yr" },
  { id: "comprehensive", title: "Comprehensive", desc: "Full coverage including theft.", price: "₦120,000/yr" },
  { id: "premium_ev", title: "Premium EV Protection", desc: "Includes total battery replacement.", price: "₦145,000/yr" },
];

export default function InsuranceQuoteScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Form State
  const [usageType, setUsageType] = useState<string | null>(null);
  const [yearsExperience, setYearsExperience] = useState<number>(5);
  const [hasClaims, setHasClaims] = useState<boolean | null>(null);
  const [coverageLevel, setCoverageLevel] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const nextStep = () => {
    if (step === 2) {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setStep(3);
      }, 1500);
    } else {
      setStep(s => Math.min(s + 1, 3));
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
    else router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <View className="flex-row items-center px-5 pt-14 pb-2">
        {step < 3 && (
          <Pressable onPress={prevStep} className="mr-4 h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <ChevronLeft size={20} color="#fafafa" />
          </Pressable>
        )}
        <View className="flex-1">
          <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime">
            {step < 3 ? `Step ${step + 1} of 3` : "Result"}
          </Text>
          <Text className="font-display-black text-xl text-foreground">
            {STEPS[step]}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      {step < 3 && (
        <View className="h-1 w-full bg-white/5">
          <Animated.View 
            className="h-full bg-lime" 
            style={{ width: `${((step + 1) / 3) * 100}%` }} 
          />
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }} className="px-5">
        
        {step === 0 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="gap-6">
            
            <View>
              <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Selected Vehicle
              </Text>
              <View className="flex-row items-center justify-between rounded-2xl border border-white/10 bg-card p-4">
                <View>
                  <Text className="text-[10px] uppercase tracking-widest text-lime">Tesla</Text>
                  <Text className="font-display-black text-lg text-foreground">Model Y Long Range</Text>
                </View>
                <View className="h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <CarFront size={20} color="#fafafa" />
                </View>
              </View>
            </View>

            <View>
              <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Primary Usage
              </Text>
              <View className="gap-3">
                {USAGE_TYPES.map(usage => (
                  <Pressable 
                    key={usage.id}
                    onPress={() => setUsageType(usage.id)}
                    className={cn(
                      "rounded-2xl border p-4 flex-row items-center gap-4",
                      usageType === usage.id ? "border-primary bg-primary/10" : "border-white/10 bg-card"
                    )}
                  >
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-white/5">
                      <usage.icon size={20} color={usageType === usage.id ? "#b3f835" : "#fafafa"} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-display-black text-base text-foreground">{usage.title}</Text>
                      <Text className="text-xs text-muted-foreground mt-0.5">{usage.desc}</Text>
                    </View>
                    {usageType === usage.id && <CheckCircle2 size={20} color="#b3f835" />}
                  </Pressable>
                ))}
              </View>
            </View>

            <Button onPress={nextStep} className="mt-2 h-14 rounded-2xl" disabled={!usageType}>
              <Text className="font-semibold text-primary-foreground">Continue to Driver Profile</Text>
            </Button>
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="gap-8">
            <View>
              <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Years of Driving Experience
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[1, 3, 5, 10, "15+"].map(yrs => (
                  <Pressable
                    key={yrs}
                    onPress={() => setYearsExperience(typeof yrs === 'number' ? yrs : 15)}
                    className={cn(
                      "rounded-xl border px-6 py-3", 
                      yearsExperience === (typeof yrs === 'number' ? yrs : 15) ? "border-primary/60 bg-primary/15" : "border-white/10 bg-card"
                    )}
                  >
                    <Text className={cn("text-sm font-semibold", yearsExperience === (typeof yrs === 'number' ? yrs : 15) ? "text-lime" : "text-muted-foreground")}>
                      {yrs} {typeof yrs === 'number' ? "yrs" : ""}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Any claims in the last 3 years?
              </Text>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setHasClaims(true)}
                  className={cn(
                    "flex-1 items-center justify-center rounded-2xl border py-4",
                    hasClaims === true ? "border-primary bg-primary/10" : "border-white/10 bg-card"
                  )}
                >
                  <Text className={cn("font-display-black text-lg", hasClaims === true ? "text-lime" : "text-foreground")}>Yes</Text>
                </Pressable>
                <Pressable
                  onPress={() => setHasClaims(false)}
                  className={cn(
                    "flex-1 items-center justify-center rounded-2xl border py-4",
                    hasClaims === false ? "border-primary bg-primary/10" : "border-white/10 bg-card"
                  )}
                >
                  <Text className={cn("font-display-black text-lg", hasClaims === false ? "text-lime" : "text-foreground")}>No</Text>
                </Pressable>
              </View>
            </View>

            <Button onPress={nextStep} className="mt-2 h-14 rounded-2xl" disabled={hasClaims === null}>
              <Text className="font-semibold text-primary-foreground">Continue to Coverage</Text>
            </Button>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="gap-6">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Select Coverage Level
            </Text>
            
            <View className="gap-3">
              {COVERAGE_LEVELS.map(level => (
                <Pressable 
                  key={level.id}
                  onPress={() => setCoverageLevel(level.id)}
                  className={cn(
                    "rounded-2xl border p-5 relative overflow-hidden",
                    coverageLevel === level.id ? "border-primary bg-primary/10" : "border-white/10 bg-card"
                  )}
                >
                  {level.id === "premium_ev" && (
                    <View className="absolute top-0 right-0 bg-lime px-3 py-1 rounded-bl-xl z-10">
                      <Text className="text-[9px] font-semibold uppercase tracking-widest text-[#060606]">Recommended</Text>
                    </View>
                  )}
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-4">
                      <View className="flex-row items-center gap-2 mb-1">
                        {level.id === "premium_ev" && <Zap size={14} color="#b3f835" />}
                        <Text className="font-display-black text-lg text-foreground">{level.title}</Text>
                      </View>
                      <Text className="text-xs text-muted-foreground">{level.desc}</Text>
                    </View>
                    <Text className="font-display-black text-sm text-lime">{level.price}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <Button onPress={nextStep} className="mt-4 h-14 rounded-2xl" disabled={!coverageLevel || isGenerating}>
              <Text className="font-semibold text-primary-foreground">
                {isGenerating ? "Calculating Quote..." : "Generate Quote"}
              </Text>
            </Button>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeIn} className="items-center pt-8">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/20 mb-6 border border-primary/30">
              <ShieldCheck size={48} color="#b3f835" />
            </View>
            <Text className="font-display-black text-3xl text-foreground mb-2 text-center">Your Quote is Ready!</Text>
            <Text className="text-center text-sm text-muted-foreground px-4 mb-8">
              Based on your clean driving history, we've found the perfect EV coverage plan for you.
            </Text>
            
            <View className="w-full rounded-3xl border border-primary/30 bg-card p-6 mb-8 overflow-hidden relative">
              <View className="absolute -right-4 -top-4 opacity-5">
                <Shield size={120} />
              </View>
              
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime mb-1">Provider: AXA Mansard</Text>
              <Text className="font-display-black text-2xl text-foreground mb-4">
                {COVERAGE_LEVELS.find(l => l.id === coverageLevel)?.title || "Premium EV Protection"}
              </Text>
              
              <View className="border-t border-white/10 pt-4 mt-2">
                <Text className="text-xs text-muted-foreground mb-1">Estimated Premium</Text>
                <View className="flex-row items-end gap-1">
                  <Text className="font-display-black text-4xl text-lime">
                    {COVERAGE_LEVELS.find(l => l.id === coverageLevel)?.price.split("/")[0] || "₦145,000"}
                  </Text>
                  <Text className="text-sm text-muted-foreground mb-1 font-semibold">/year</Text>
                </View>
              </View>
            </View>

            <Pressable 
              onPress={() => router.push("/explore")}
              className="h-14 w-full rounded-2xl bg-lime flex-row items-center justify-center gap-2"
            >
              <Text className="font-semibold text-[#060606] text-base">Bind Coverage Now</Text>
            </Pressable>
          </Animated.View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
