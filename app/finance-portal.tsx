import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Wallet, Calculator, Percent, ArrowRight } from "lucide-react-native";
import { PageHeader } from "@/components/page-header";
import Animated, { FadeInDown } from "react-native-reanimated";

const PARTNERS = [
  { name: "Stanbic IBTC", rate: "12.5%", term: "up to 60 mos" },
  { name: "Access Bank", rate: "13.0%", term: "up to 48 mos" },
  { name: "Guaranty Trust", rate: "14.2%", term: "up to 36 mos" },
];

export default function FinancePortalScreen() {
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Finance" subtitle="Flexible ownership options" showBack />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="px-5">
        
        {/* Pre-approval CTA */}
        <Animated.View entering={FadeInDown.springify()} className="mt-4 overflow-hidden rounded-3xl bg-lime p-6">
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-[#060606]">
            <Wallet size={24} color="#b3f835" />
          </View>
          <Text className="font-display-black text-2xl text-[#060606]">Get Pre-approved</Text>
          <Text className="mt-2 text-sm text-[#060606] opacity-80 leading-snug">
            Check your EV purchasing power in minutes without affecting your credit score.
          </Text>
          <Pressable 
            onPress={() => router.push("/finance/apply")}
            className="mt-6 flex-row items-center justify-center gap-2 rounded-xl bg-[#060606] py-3.5"
          >
            <Text className="font-semibold text-lime text-sm">Start Application</Text>
            <ArrowRight size={16} color="#b3f835" />
          </Pressable>
        </Animated.View>

        {/* Affordability Calculator Mock */}
        <Animated.View entering={FadeInDown.delay(100).springify()} className="mt-6 rounded-2xl border border-white/10 bg-card p-5">
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Calculator size={16} color="#b3f835" />
            </View>
            <Text className="font-display-black text-lg text-foreground">Affordability Check</Text>
          </View>
          
          <View className="gap-3">
            <View className="rounded-xl border border-white/5 bg-[#111] p-3">
              <Text className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Monthly Budget</Text>
              <Text className="font-semibold text-foreground text-base">₦ 450,000</Text>
            </View>
            <View className="rounded-xl border border-white/5 bg-[#111] p-3">
              <Text className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Down Payment</Text>
              <Text className="font-semibold text-foreground text-base">₦ 2,500,000</Text>
            </View>
          </View>
          
          <Pressable className="mt-4 items-center justify-center rounded-xl bg-white/10 py-3">
            <Text className="text-xs font-semibold text-foreground">Calculate Options</Text>
          </Pressable>
        </Animated.View>

        {/* Partner Rates */}
        <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-8">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Current Partner Rates
          </Text>
          <View className="gap-3">
            {PARTNERS.map((bank, index) => (
              <View key={index} className="flex-row items-center justify-between rounded-xl border border-white/5 bg-card p-4">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    <Percent size={16} color="#fafafa" />
                  </View>
                  <View>
                    <Text className="font-display-black text-sm text-foreground">{bank.name}</Text>
                    <Text className="text-[11px] text-muted-foreground mt-0.5">{bank.term}</Text>
                  </View>
                </View>
                <Text className="font-display-black text-lg text-lime">{bank.rate}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
