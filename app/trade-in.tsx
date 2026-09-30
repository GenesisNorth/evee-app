import { useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { PageHeader } from "@/components/page-header";
import { CarFront, ArrowRight, RefreshCw, BadgeCent, ChevronRight, Zap } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function TradeInScreen() {
  const [step, setStep] = useState(0);

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Resale & Trade-in" subtitle="Upgrade your journey" showBack />
      
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {step === 0 && (
          <Animated.View entering={FadeInDown} className="gap-8">
            <View className="items-center mt-6 mb-2">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 mb-6">
                <RefreshCw size={36} color="#b3f835" />
              </View>
              <Text className="font-display-black text-3xl text-foreground text-center mb-3">Upgrade to Next-Gen</Text>
              <Text className="text-base text-muted-foreground text-center px-4 leading-6">
                Evee offers guaranteed buybacks on all our vehicles. Trade in your current EV and roll your equity into a newer model effortlessly.
              </Text>
            </View>

            <View>
              <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Select Vehicle to Trade</Text>
              
              <Pressable 
                onPress={() => setStep(1)}
                className="flex-row items-center rounded-2xl border border-white/10 bg-card p-4 overflow-hidden mb-3"
              >
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop" }} 
                  className="h-16 w-24 rounded-lg mr-4 bg-white/5" 
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="font-display-black text-base text-foreground mb-1">Tesla Model 3</Text>
                  <Text className="text-xs text-muted-foreground">2023 • Long Range</Text>
                  <Text className="text-xs text-lime mt-1 font-semibold">24,500 km</Text>
                </View>
                <ChevronRight size={20} color="#4d4d4d" />
              </Pressable>

              <Pressable className="h-16 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] items-center justify-center flex-row gap-2">
                <CarFront size={16} color="#888" />
                <Text className="font-semibold text-muted-foreground">Add external vehicle</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View entering={FadeInDown} className="gap-8">
            <View>
              <Text className="font-display-black text-2xl text-foreground">Valuation Estimate</Text>
              <Text className="text-sm text-muted-foreground mt-1">Based on market data, battery health (98%), and mileage.</Text>
            </View>

            <View className="rounded-3xl border border-lime/30 bg-lime/10 p-6 items-center">
              <BadgeCent size={40} color="#b3f835" className="mb-4" />
              <Text className="text-sm font-semibold text-lime uppercase tracking-widest mb-1">Estimated Trade-In Value</Text>
              <Text className="font-display-black text-5xl text-foreground">$28,500</Text>
              <Text className="text-xs text-muted-foreground mt-2 text-center px-4">
                Valid for 7 days. Final value pending physical inspection.
              </Text>
            </View>

            <View className="gap-4">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Next Steps</Text>
              
              <View className="flex-row items-center rounded-2xl border border-white/10 bg-card p-4">
                <View className="h-10 w-10 rounded-full bg-blue-500/10 items-center justify-center mr-4">
                  <Text className="font-bold text-blue-500">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Apply to New Vehicle</Text>
                  <Text className="text-xs text-muted-foreground">Use this equity as a down payment</Text>
                </View>
              </View>

              <View className="flex-row items-center rounded-2xl border border-white/10 bg-card p-4">
                <View className="h-10 w-10 rounded-full bg-white/5 items-center justify-center mr-4">
                  <Text className="font-bold text-muted-foreground">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Schedule Inspection</Text>
                  <Text className="text-xs text-muted-foreground">We come to you to verify condition</Text>
                </View>
              </View>
            </View>

            <Pressable 
              onPress={() => setStep(2)}
              className="h-14 w-full rounded-2xl bg-lime flex-row items-center justify-center gap-2 mt-4 shadow-[0_0_15px_rgba(179,248,53,0.2)]"
            >
              <Text className="font-display-black text-sm text-[#060606] uppercase tracking-widest">Browse Vehicles to Upgrade</Text>
              <ArrowRight size={16} color="#060606" strokeWidth={3} />
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
