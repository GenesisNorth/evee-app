import { View, Text, ScrollView, Pressable } from "react-native";
import { PageHeader } from "@/components/page-header";
import { FileText, Download, ShieldCheck, FileSignature, Car, ArrowRight, MoreVertical } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const DOCUMENTS = [
  { id: "1", title: "Vehicle Registration", subtitle: "Valid until Oct 2027", icon: Car, color: "#3b82f6" },
  { id: "2", title: "Comprehensive Insurance", subtitle: "Active • Policy #INS-4920", icon: ShieldCheck, color: "#10b981" },
  { id: "3", title: "Evee Extended Warranty", subtitle: "Covers Battery & Drivetrain", icon: FileSignature, color: "#a855f7" },
  { id: "4", title: "Purchase Agreement", subtitle: "Signed Oct 12, 2026", icon: FileText, color: "#f59e0b" },
];

export default function DocumentsScreen() {
  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Documents Vault" subtitle="Secure digital records" showBack />
      
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Secure Vault Graphic */}
        <Animated.View entering={FadeInDown} className="mb-8 items-center pt-4">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 mb-4">
            <ShieldCheck size={40} color="#b3f835" />
          </View>
          <Text className="font-display-black text-2xl text-foreground text-center">Encrypted Vault</Text>
          <Text className="text-sm text-muted-foreground text-center mt-2 px-6">
            All your vital vehicle documents, securely stored and accessible anytime, anywhere.
          </Text>
        </Animated.View>

        <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Official Records
        </Text>

        <View className="gap-4">
          {DOCUMENTS.map((doc, i) => (
            <Animated.View key={doc.id} entering={FadeInDown.delay(i * 100)}>
              <Pressable className="flex-row items-center rounded-2xl border border-white/10 bg-card p-4 overflow-hidden">
                <LinearGradient 
                  colors={[doc.color + '15', 'transparent']} 
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                  className="absolute inset-0"
                />
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/5 mr-4" style={{ borderWidth: 1, borderColor: doc.color + '30' }}>
                  <doc.icon size={22} color={doc.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-display-black text-base text-foreground mb-1">{doc.title}</Text>
                  <Text className="text-xs text-muted-foreground">{doc.subtitle}</Text>
                </View>
                <View className="flex-row gap-3">
                  <Pressable className="h-8 w-8 items-center justify-center rounded-full bg-white/5">
                    <Download size={14} color="#fafafa" />
                  </Pressable>
                  <Pressable className="h-8 w-8 items-center justify-center rounded-full bg-white/5">
                    <MoreVertical size={14} color="#fafafa" />
                  </Pressable>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(500)} className="mt-8 rounded-3xl border border-dashed border-white/20 bg-white/[0.02] p-6 items-center justify-center">
          <View className="h-12 w-12 rounded-full bg-white/5 items-center justify-center mb-3">
            <FileText size={20} color="#888" />
          </View>
          <Text className="font-display-black text-sm text-foreground mb-1">Upload New Document</Text>
          <Text className="text-xs text-muted-foreground text-center">Store service receipts or custom certificates</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
