import { View, Text, ScrollView } from "react-native";
import { PageHeader } from "@/components/page-header";
import { Battery, Activity, AlertTriangle } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function BatteryHealthScreen() {
  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Battery Health" subtitle="Tesla Model Y" showBack />
      <ScrollView className="px-5 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="items-center mb-8">
          <Animated.View entering={FadeInUp.springify()} className="relative items-center justify-center">
            {/* Mock Circular Progress */}
            <View className="h-48 w-48 rounded-full border-[12px] border-white/5 items-center justify-center">
              <View className="absolute inset-0 rounded-full border-[12px] border-lime" style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{rotate: '45deg'}] }} />
              <Text className="font-display-black text-5xl text-foreground">94<Text className="text-2xl">%</Text></Text>
              <Text className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Health Score</Text>
            </View>
          </Animated.View>
        </View>

        <View className="gap-3">
          <View className="rounded-2xl border border-white/[0.06] bg-card p-4 flex-row items-center gap-4">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Activity size={20} color="#b3f835" />
            </View>
            <View className="flex-1">
              <Text className="font-display text-sm text-foreground">Degradation Rate</Text>
              <Text className="text-xs text-muted-foreground">Normal (1.2% per year)</Text>
            </View>
            <Text className="font-bold text-foreground">Good</Text>
          </View>

          <View className="rounded-2xl border border-white/[0.06] bg-card p-4 flex-row items-center gap-4">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <Battery size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="font-display text-sm text-foreground">Charge Cycles</Text>
              <Text className="text-xs text-muted-foreground">Lifetime full cycles</Text>
            </View>
            <Text className="font-bold text-foreground">342</Text>
          </View>

          <View className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 mt-4 flex-row items-start gap-3">
            <AlertTriangle size={18} color="#f59e0b" />
            <View className="flex-1">
              <Text className="font-bold text-sm text-amber-500">Pro Tip</Text>
              <Text className="text-xs text-muted-foreground mt-1 leading-4">To prolong battery life, try to keep your daily charge limit to 80% unless you are planning a long road trip.</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
