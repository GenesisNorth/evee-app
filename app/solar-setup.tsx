import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { PageHeader } from "@/components/page-header";
import { Sun, ArrowRight, Home, BatteryMedium, Calendar, CreditCard, CheckCircle2 } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { cn } from "@/lib/utils";

const STEPS = ["Needs Form", "Site Review", "Estimate", "Financing"];

export default function SolarSetupScreen() {
  const [step, setStep] = useState(0);

  // Form State
  const [propertyType, setPropertyType] = useState("detached");
  const [bill, setBill] = useState("");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Solar Setup" subtitle="Power your home & EV" showBack />
      
      <View className="px-5 mt-4">
        <View className="flex-row items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <View key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-lime" : "bg-white/[0.08]")} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}>
        {step === 0 && (
          <Animated.View entering={FadeInDown} className="gap-6">
            <View>
              <Text className="font-display-black text-2xl text-foreground">Energy Needs</Text>
              <Text className="text-sm text-muted-foreground mt-1">Tell us about your property to get an accurate estimate.</Text>
            </View>

            <View className="gap-3">
              <Text className="text-xs font-semibold text-white/50 ml-1 uppercase tracking-wider">Property Type</Text>
              <View className="flex-row gap-3">
                <Pressable onPress={() => setPropertyType('detached')} className={cn("flex-1 rounded-2xl border p-4 items-center gap-2", propertyType === 'detached' ? "border-primary bg-primary/10" : "border-white/10 bg-card")}>
                  <Home size={20} color={propertyType === 'detached' ? "#b3f835" : "#fafafa"} />
                  <Text className={cn("text-sm font-semibold", propertyType === 'detached' ? "text-lime" : "text-foreground")}>Detached</Text>
                </Pressable>
                <Pressable onPress={() => setPropertyType('terrace')} className={cn("flex-1 rounded-2xl border p-4 items-center gap-2", propertyType === 'terrace' ? "border-primary bg-primary/10" : "border-white/10 bg-card")}>
                  <BatteryMedium size={20} color={propertyType === 'terrace' ? "#b3f835" : "#fafafa"} />
                  <Text className={cn("text-sm font-semibold", propertyType === 'terrace' ? "text-lime" : "text-foreground")}>Terrace</Text>
                </Pressable>
              </View>
            </View>

            <View>
              <Text className="text-xs font-semibold text-white/50 ml-1 mb-1.5 uppercase tracking-wider">Average Monthly Power Bill (NGN)</Text>
              <TextInput 
                className="h-14 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-foreground"
                placeholder="E.g. 50,000"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="numeric"
                value={bill}
                onChangeText={setBill}
              />
            </View>

            <Pressable 
              onPress={() => setStep(1)}
              className="h-14 w-full rounded-2xl bg-lime flex-row items-center justify-center gap-2 mt-4"
            >
              <Text className="font-display-black text-sm text-[#060606] uppercase tracking-widest">Next Step</Text>
              <ArrowRight size={16} color="#060606" strokeWidth={3} />
            </Pressable>
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View entering={FadeInDown} className="gap-6">
            <View>
              <Text className="font-display-black text-2xl text-foreground">Site Review</Text>
              <Text className="text-sm text-muted-foreground mt-1">Schedule an engineering visit to inspect your roof and electrical panel.</Text>
            </View>

            <View>
              <Text className="text-xs font-semibold text-white/50 ml-1 mb-1.5 uppercase tracking-wider">Preferred Date</Text>
              <View className="h-14 rounded-2xl border border-white/10 bg-white/[0.05] px-5 flex-row items-center">
                <Calendar size={18} color="rgba(255,255,255,0.5)" className="mr-3" />
                <TextInput 
                  className="flex-1 text-foreground"
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>

            <Pressable 
              onPress={() => setStep(2)}
              className="h-14 w-full rounded-2xl bg-lime flex-row items-center justify-center gap-2 mt-4"
            >
              <Text className="font-display-black text-sm text-[#060606] uppercase tracking-widest">Get Estimate</Text>
              <ArrowRight size={16} color="#060606" strokeWidth={3} />
            </Pressable>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInDown} className="gap-6">
            <View>
              <Text className="font-display-black text-2xl text-foreground">Initial Estimate</Text>
              <Text className="text-sm text-muted-foreground mt-1">Based on your inputs, here is your preliminary system design.</Text>
            </View>

            <View className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
              <View className="items-center mb-6">
                <Sun size={48} color="#b3f835" />
                <Text className="font-display-black text-2xl text-foreground mt-4">10kW Hybrid System</Text>
                <Text className="text-sm text-muted-foreground">Includes 15kWh Battery Storage + 7kW EV Charger</Text>
              </View>
              
              <View className="gap-3 border-t border-white/10 pt-4">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted-foreground">Hardware & Panels</Text>
                  <Text className="text-sm font-semibold text-foreground">$12,500</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted-foreground">Installation & Permits</Text>
                  <Text className="text-sm font-semibold text-foreground">$2,200</Text>
                </View>
                <View className="flex-row justify-between mt-2 pt-2 border-t border-white/5">
                  <Text className="font-semibold text-foreground">Total Estimate</Text>
                  <Text className="font-bold text-lime">$14,700</Text>
                </View>
              </View>
            </View>

            <Pressable 
              onPress={() => setStep(3)}
              className="h-14 w-full rounded-2xl bg-lime flex-row items-center justify-center gap-2"
            >
              <Text className="font-display-black text-sm text-[#060606] uppercase tracking-widest">View Financing</Text>
              <ArrowRight size={16} color="#060606" strokeWidth={3} />
            </Pressable>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeInDown} className="gap-6">
            {!submitted ? (
              <>
                <View>
                  <Text className="font-display-black text-2xl text-foreground">Financing Option</Text>
                  <Text className="text-sm text-muted-foreground mt-1">Solar infrastructure can be financed through our partner institutions.</Text>
                </View>

                <View className="rounded-2xl border border-primary/50 bg-primary/10 p-5 relative overflow-hidden">
                  <View className="absolute top-0 right-0 p-3 bg-primary/20 rounded-bl-2xl">
                    <Text className="text-[10px] font-bold text-lime uppercase tracking-widest">Recommended</Text>
                  </View>
                  <CreditCard size={24} color="#b3f835" className="mb-3" />
                  <Text className="font-display-black text-xl text-foreground mb-1">Evee Green Loan</Text>
                  <Text className="text-sm text-muted-foreground mb-4">Pay over 36 months</Text>
                  
                  <View className="flex-row items-end gap-1 mb-2">
                    <Text className="font-display-black text-3xl text-foreground">$450</Text>
                    <Text className="text-sm text-muted-foreground mb-1">/ month</Text>
                  </View>
                  <Text className="text-xs text-lime">Saves you $500/mo on diesel</Text>
                </View>

                <Pressable 
                  onPress={() => setSubmitted(true)}
                  className="h-14 w-full rounded-2xl bg-lime flex-row items-center justify-center gap-2 mt-4"
                >
                  <Text className="font-display-black text-sm text-[#060606] uppercase tracking-widest">Submit Application</Text>
                  <ArrowRight size={16} color="#060606" strokeWidth={3} />
                </Pressable>
              </>
            ) : (
              <View className="items-center py-10">
                <View className="h-20 w-20 rounded-full bg-lime/20 items-center justify-center mb-6 border border-lime/30">
                  <CheckCircle2 size={40} color="#b3f835" />
                </View>
                <Text className="font-display-black text-2xl text-foreground text-center mb-2">Quote Requested!</Text>
                <Text className="text-sm text-muted-foreground text-center px-4 leading-6">
                  Your site review has been scheduled for {date || "next week"}. An Evee Solar Partner will contact you shortly to confirm.
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
