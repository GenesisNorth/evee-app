import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { ShieldCheck, FileText, Umbrella, ArrowRight } from "lucide-react-native";
import { PageHeader } from "@/components/page-header";
import Animated, { FadeInDown } from "react-native-reanimated";

const POLICIES = [
  { provider: "Leadway Assurance", type: "Comprehensive", price: "₦120,000/yr" },
  { provider: "AXA Mansard", type: "Comprehensive + Battery", price: "₦145,000/yr" },
];

export default function InsurePortalScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Insurance" subtitle="Protect your investment" showBack />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="px-5">
        
        {/* Active Policy Status (Mock) */}
        <Animated.View entering={FadeInDown.springify()} className="mt-4 rounded-3xl border border-primary/30 bg-primary/10 p-6 items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-3">
            <ShieldCheck size={32} color="#b3f835" />
          </View>
          <Text className="font-display-black text-xl text-foreground">Fully Protected</Text>
          <Text className="mt-1 text-xs text-muted-foreground text-center">
            Your Tesla Model Y is currently insured with comprehensive EV coverage.
          </Text>
          <Pressable className="mt-5 flex-row items-center justify-center gap-2 rounded-xl bg-lime px-6 py-3">
            <Text className="font-semibold text-primary-foreground text-sm">View Policy</Text>
          </Pressable>
        </Animated.View>

        {/* Get a Quote Action */}
        <Animated.View entering={FadeInDown.delay(100).springify()} className="mt-6 rounded-2xl border border-white/10 bg-card p-1">
          <Pressable 
            onPress={() => router.push("/insure/quote")}
            className="flex-row items-center p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-white/5">
              <Umbrella size={20} color="#fafafa" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-display-black text-sm text-foreground">Get a New Quote</Text>
              <Text className="text-[11px] text-muted-foreground mt-0.5">Compare specialized EV policies.</Text>
            </View>
            <ArrowRight size={16} color="#4d4d4d" />
          </Pressable>
        </Animated.View>

        {/* Compare Providers */}
        <Animated.View entering={FadeInDown.delay(200).springify()} className="mt-8">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Featured EV Plans
          </Text>
          <View className="gap-3">
            {POLICIES.map((policy, index) => (
              <View key={index} className="flex-row items-center justify-between rounded-xl border border-white/5 bg-card p-4">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    <FileText size={16} color="#fafafa" />
                  </View>
                  <View>
                    <Text className="font-display-black text-sm text-foreground">{policy.provider}</Text>
                    <Text className="text-[11px] text-muted-foreground mt-0.5">{policy.type}</Text>
                  </View>
                </View>
                <Text className="font-display-black text-sm text-lime">{policy.price}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
