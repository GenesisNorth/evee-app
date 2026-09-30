import { View, Text, ScrollView, Pressable } from "react-native";
import { PageHeader } from "@/components/page-header";
import { Shield, ShieldAlert, Phone, ArrowRight, CheckCircle2, FileText, AlertCircle } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function InsuranceScreen() {
  return (
    <View className="flex-1 bg-background">
      <PageHeader title="EV Insurance" subtitle="Comprehensive coverage" showBack />
      
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Active Policy Card */}
        <Animated.View entering={FadeInDown} className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 relative overflow-hidden mb-8">
          <View className="absolute -right-4 -top-4 opacity-10">
            <Shield size={120} color="#10b981" />
          </View>
          
          <View className="flex-row items-center gap-2 mb-6">
            <View className="h-2 w-2 rounded-full bg-emerald-400" />
            <Text className="text-xs font-bold uppercase tracking-widest text-emerald-400">Active Policy</Text>
          </View>
          
          <Text className="font-display-black text-3xl text-foreground mb-1">Evee Protect Max</Text>
          <Text className="text-sm text-muted-foreground mb-8">Policy #INS-4920-X8</Text>
          
          <View className="flex-row justify-between items-end border-t border-emerald-500/20 pt-4">
            <View>
              <Text className="text-xs text-muted-foreground mb-1">Next Renewal</Text>
              <Text className="font-semibold text-foreground">Oct 12, 2027</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-muted-foreground mb-1">Premium</Text>
              <Text className="font-bold text-emerald-400">$85/mo</Text>
            </View>
          </View>
        </Animated.View>

        <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Coverage Details
        </Text>

        <Animated.View entering={FadeInDown.delay(100)} className="rounded-2xl border border-white/10 bg-card p-5 mb-8">
          <View className="flex-row items-center gap-3 mb-4">
            <CheckCircle2 size={16} color="#b3f835" />
            <Text className="text-sm text-foreground">Full comprehensive collision</Text>
          </View>
          <View className="flex-row items-center gap-3 mb-4">
            <CheckCircle2 size={16} color="#b3f835" />
            <Text className="text-sm text-foreground">Dedicated EV battery replacement</Text>
          </View>
          <View className="flex-row items-center gap-3 mb-4">
            <CheckCircle2 size={16} color="#b3f835" />
            <Text className="text-sm text-foreground">24/7 Roadside & Towing to chargers</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <CheckCircle2 size={16} color="#b3f835" />
            <Text className="text-sm text-foreground">$500 Deductible</Text>
          </View>
        </Animated.View>

        <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Support & Claims
        </Text>
        
        <View className="flex-row gap-4 mb-4">
          <Animated.View entering={FadeInDown.delay(200)} className="flex-1">
            <Pressable className="h-32 rounded-2xl border border-red-500/30 bg-red-500/10 items-center justify-center p-4">
              <ShieldAlert size={28} color="#ef4444" className="mb-3" />
              <Text className="font-display-black text-sm text-foreground text-center">File a Claim</Text>
            </Pressable>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(300)} className="flex-1">
            <Pressable className="h-32 rounded-2xl border border-blue-500/30 bg-blue-500/10 items-center justify-center p-4">
              <Phone size={28} color="#3b82f6" className="mb-3" />
              <Text className="font-display-black text-sm text-foreground text-center">Roadside Assist</Text>
            </Pressable>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <Pressable className="h-14 rounded-xl border border-white/10 bg-white/5 flex-row items-center px-4 justify-between">
            <View className="flex-row items-center gap-3">
              <FileText size={18} color="#888" />
              <Text className="font-medium text-foreground">View Policy Documents</Text>
            </View>
            <ArrowRight size={16} color="#888" />
          </Pressable>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
