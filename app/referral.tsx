import { View, Text, Pressable, ScrollView, Share } from "react-native";
import { PageHeader } from "@/components/page-header";
import { Gift, Copy, Share2 } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function ReferralScreen() {
  const code = "EVEE-GENESIS-26";

  async function copyToClipboard() {
    Toast.show({ type: "success", text1: "Copied to clipboard!" });
  }

  async function shareCode() {
    await Share.share({ message: `Use my Evee code ${code} to get $500 off your first EV purchase!` });
  }

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Refer & Earn" showBack />
      <ScrollView className="px-5 pt-8">
        <View className="items-center mb-8">
          <View className="h-20 w-20 rounded-full bg-primary/20 items-center justify-center mb-4 border border-primary/50">
            <Gift size={32} color="#b3f835" />
          </View>
          <Text className="font-display-black text-2xl text-foreground text-center">Give $500, Get $500</Text>
          <Text className="text-sm text-muted-foreground text-center mt-2 px-4">
            Invite friends to Evee. When they buy their first EV, you both get $500 cash back.
          </Text>
        </View>

        <View className="rounded-2xl border border-white/[0.06] bg-card p-5">
          <Text className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Your Unique Code</Text>
          <View className="flex-row items-center justify-between rounded-xl bg-white/[0.03] p-4 border border-white/5">
            <Text className="font-display-black text-xl text-lime tracking-widest">{code}</Text>
            <Pressable onPress={copyToClipboard} className="h-10 w-10 bg-white/5 rounded-full items-center justify-center">
              <Copy size={16} color="#fafafa" />
            </Pressable>
          </View>

          <Pressable onPress={shareCode} className="mt-4 flex-row items-center justify-center h-14 rounded-xl bg-lime gap-2">
            <Share2 size={18} color="#060606" />
            <Text className="font-semibold text-[#060606]">Share Link</Text>
          </Pressable>
        </View>

        <View className="mt-8">
          <Text className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Your Referrals (0)</Text>
          <View className="rounded-2xl border border-dashed border-white/20 p-8 items-center">
            <Text className="text-sm text-muted-foreground text-center">No successful referrals yet. Start sharing!</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
