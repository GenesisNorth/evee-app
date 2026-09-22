import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { CheckCircle2, ChevronLeft, UploadCloud, Zap, CarFront } from "lucide-react-native";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from "react-native-reanimated";

const STEPS = ["Identity", "Financials", "Documents", "Result"];
const EMPLOYMENT_OPTS = ["Full-time", "Self-employed", "Business Owner", "Contract"];

export default function FinanceApplyScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Form State
  const [bvn, setBvn] = useState("");
  const [income, setIncome] = useState("500000");
  const [employment, setEmployment] = useState(EMPLOYMENT_OPTS[0]);
  const [docUploaded, setDocUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => {
    if (step === 2) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
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
            {step < 3 ? `Step ${step + 1} of 3` : "Decision"}
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
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="gap-5">
            <View className="gap-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Legal Full Name</Label>
              <Input placeholder="As it appears on your ID" />
            </View>
            <View className="gap-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bank Verification Number (BVN)</Label>
              <Input 
                keyboardType="numeric" 
                maxLength={11} 
                value={bvn}
                onChangeText={setBvn}
                placeholder="11-digit BVN" 
              />
              <Text className="text-[10px] text-muted-foreground mt-1">
                Your BVN is used to securely verify your identity and credit history.
              </Text>
            </View>
            <Button onPress={nextStep} className="mt-4 h-14 rounded-2xl" disabled={bvn.length < 11}>
              <Text className="font-semibold text-primary-foreground">Continue to Financials</Text>
            </Button>
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="gap-5">
            <View className="gap-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Monthly Net Income (₦)</Label>
              <Input 
                keyboardType="numeric" 
                value={income}
                onChangeText={setIncome}
              />
            </View>
            <View className="gap-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Employment Status</Label>
              <View className="flex-row flex-wrap gap-2">
                {EMPLOYMENT_OPTS.map(opt => (
                  <Pressable
                    key={opt}
                    onPress={() => setEmployment(opt)}
                    className={cn(
                      "rounded-xl border px-4 py-2.5", 
                      employment === opt ? "border-primary/60 bg-primary/15" : "border-white/10 bg-white/[0.03]"
                    )}
                  >
                    <Text className={cn("text-xs font-semibold", employment === opt ? "text-lime" : "text-muted-foreground")}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <Button onPress={nextStep} className="mt-4 h-14 rounded-2xl">
              <Text className="font-semibold text-primary-foreground">Continue to Documents</Text>
            </Button>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="gap-5">
            <View className="rounded-2xl border border-white/10 bg-card p-6 items-center border-dashed">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-3">
                <UploadCloud size={24} color="#fafafa" />
              </View>
              <Text className="font-display-black text-base text-foreground mb-1">6-Month Bank Statement</Text>
              <Text className="text-center text-xs text-muted-foreground mb-5 px-4">
                Upload a PDF of your most recent bank statement to verify your income flow.
              </Text>
              
              <Pressable 
                onPress={() => setDocUploaded(!docUploaded)}
                className={cn(
                  "h-12 w-full rounded-xl flex-row items-center justify-center gap-2",
                  docUploaded ? "bg-primary/20" : "bg-white/10"
                )}
              >
                {docUploaded && <CheckCircle2 size={16} color="#b3f835" />}
                <Text className={cn("font-semibold text-sm", docUploaded ? "text-lime" : "text-foreground")}>
                  {docUploaded ? "Statement_Oct2023.pdf Attached" : "Select File"}
                </Text>
              </Pressable>
            </View>

            <Button onPress={nextStep} className="mt-4 h-14 rounded-2xl" disabled={!docUploaded || isSubmitting}>
              <Text className="font-semibold text-primary-foreground">
                {isSubmitting ? "Analyzing Profile..." : "Submit Application"}
              </Text>
            </Button>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeIn} className="items-center pt-8">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/20 mb-6">
              <CheckCircle2 size={48} color="#b3f835" />
            </View>
            <Text className="font-display-black text-3xl text-foreground mb-2">Pre-Approved!</Text>
            <Text className="text-center text-sm text-muted-foreground px-4 mb-8">
              Congratulations! Based on your profile, you are pre-approved for EV financing up to:
            </Text>
            
            <View className="w-full rounded-3xl border border-primary/30 bg-primary/10 p-6 items-center mb-8">
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime mb-1">Purchasing Power</Text>
              <Text className="font-display-black text-4xl text-foreground">₦ 28,500,000</Text>
              <Text className="mt-2 text-xs text-muted-foreground">Estimated APR: 12.5% over 60 mos</Text>
            </View>

            <Pressable 
              onPress={() => router.push("/explore")}
              className="h-14 w-full rounded-2xl bg-lime flex-row items-center justify-center gap-2"
            >
              <CarFront size={20} color="#060606" />
              <Text className="font-semibold text-primary-foreground text-base">Browse Eligible EVs</Text>
            </Pressable>
          </Animated.View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
