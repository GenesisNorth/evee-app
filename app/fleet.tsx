import { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, TextInput } from "react-native";
import { PageHeader } from "@/components/page-header";
import { Briefcase, Package, TrendingUp, Zap, ArrowRight, CheckCircle2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function FleetScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [fleetSize, setFleetSize] = useState("");

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="EVEE for Business" subtitle="Scale with clean energy" showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} className="flex-1">
        
        {/* Hero Section */}
        <View className="relative h-[250px] w-full">
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1590212151175-e58edd96185b?q=80&w=1000&auto=format&fit=crop" }} 
            className="h-full w-full opacity-60" 
            style={{ resizeMode: "cover" }} 
          />
          <LinearGradient
            colors={["transparent", "#040404"]}
            className="absolute inset-0"
          />
          <View className="absolute bottom-0 left-0 right-0 p-6 pb-8">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-lime mb-2">Fleet Solutions</Text>
            <Text className="font-display-black text-3xl text-white mb-2">Power your business.</Text>
            <Text className="text-sm text-white/80 leading-5">
              Corporate acquisition, bulk financing, and dedicated infrastructure planning for modern African enterprises.
            </Text>
          </View>
        </View>

        <View className="px-5 pt-4">
          
          {/* Capabilities Grid */}
          <Text className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold mt-2">Enterprise Capabilities</Text>
          <View className="flex-row flex-wrap gap-3 mb-10">
            <View className="w-[48%] rounded-2xl border border-white/[0.06] bg-card p-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3 border border-primary/20">
                <Package size={20} color="#b3f835" />
              </View>
              <Text className="font-display-black text-sm text-foreground mb-1">Bulk Orders</Text>
              <Text className="text-[11px] text-muted-foreground">Volume purchases made simple.</Text>
            </View>

            <View className="w-[48%] rounded-2xl border border-white/[0.06] bg-card p-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 mb-3 border border-blue-500/20">
                <Briefcase size={20} color="#3b82f6" />
              </View>
              <Text className="font-display-black text-sm text-foreground mb-1">Corporate Finance</Text>
              <Text className="text-[11px] text-muted-foreground">Tailored commercial leasing.</Text>
            </View>

            <View className="w-[48%] rounded-2xl border border-white/[0.06] bg-card p-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 mb-3 border border-purple-500/20">
                <Zap size={20} color="#a855f7" />
              </View>
              <Text className="font-display-black text-sm text-foreground mb-1">Infrastructure</Text>
              <Text className="text-[11px] text-muted-foreground">Charging and energy design.</Text>
            </View>

            <View className="w-[48%] rounded-2xl border border-white/[0.06] bg-card p-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 mb-3 border border-emerald-500/20">
                <TrendingUp size={20} color="#10b981" />
              </View>
              <Text className="font-display-black text-sm text-foreground mb-1">Cost Savings</Text>
              <Text className="text-[11px] text-muted-foreground">Lower TCO, higher impact.</Text>
            </View>
          </View>

          {/* Fleet Enquiry Form */}
          <Text className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">Fleet Enquiry</Text>
          <View className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
            {submitted ? (
              <Animated.View entering={FadeInDown} className="items-center py-6">
                <View className="h-16 w-16 rounded-full bg-lime/20 items-center justify-center mb-4 border border-lime/30">
                  <CheckCircle2 size={32} color="#b3f835" />
                </View>
                <Text className="font-display-black text-xl text-foreground text-center mb-2">Request Received</Text>
                <Text className="text-sm text-muted-foreground text-center">
                  Our enterprise team will contact {companyName || "you"} shortly to discuss your fleet requirements.
                </Text>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInDown} className="gap-4">
                <View>
                  <Text className="text-xs font-semibold text-white/50 ml-1 mb-1.5 uppercase tracking-wider">Company Name</Text>
                  <TextInput 
                    className="h-12 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-foreground"
                    placeholder="E.g. Logistics Corp"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={companyName}
                    onChangeText={setCompanyName}
                  />
                </View>
                <View>
                  <Text className="text-xs font-semibold text-white/50 ml-1 mb-1.5 uppercase tracking-wider">Estimated Fleet Size</Text>
                  <TextInput 
                    className="h-12 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-foreground"
                    placeholder="E.g. 50 vehicles"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="numeric"
                    value={fleetSize}
                    onChangeText={setFleetSize}
                  />
                </View>
                <Pressable 
                  onPress={() => setSubmitted(true)}
                  className="h-14 w-full rounded-xl bg-lime flex-row items-center justify-center gap-2 mt-2 shadow-[0_0_15px_rgba(179,248,53,0.2)]"
                >
                  <Text className="font-display-black text-sm text-[#060606] uppercase tracking-widest">Submit Enquiry</Text>
                  <ArrowRight size={16} color="#060606" strokeWidth={3} />
                </Pressable>
              </Animated.View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
