import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { LoaderCircle, Search } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SourcingScreen() {
  const router = useRouter();
  const [makeModel, setMakeModel] = useState("");
  const [budget, setBudget] = useState("");
  const [condition, setCondition] = useState("Any");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!makeModel || !budget) {
      Toast.show({ type: "error", text1: "Please fill in all required fields" });
      return;
    }
    setSubmitting(true);
    try {
      // Mock network request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Toast.show({ type: "success", text1: "Request submitted! We'll find it for you." });
      router.back();
    } catch (e) {
      Toast.show({ type: "error", text1: "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <PageHeader title="EV Sourcing" subtitle="Can't find it? We'll source it." showBack />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-5 pt-4"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="mb-8 items-center pt-4">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Search size={28} color="#b3f835" />
          </View>
          <Text className="font-display-black text-2xl text-foreground text-center">Tell us what you want</Text>
          <Text className="mt-2 text-center text-sm text-muted-foreground px-4">
            Whether it's a specific Tesla configuration or a hard-to-find electric truck, our partner network will source it for you.
          </Text>
        </View>

        <View className="gap-6 rounded-3xl border border-white/[0.06] bg-card p-5">
          <View className="gap-2">
            <Label>Target Make & Model *</Label>
            <Input
              value={makeModel}
              onChangeText={setMakeModel}
              placeholder="e.g. Tesla Model Y Long Range"
              className="h-12 rounded-xl"
            />
          </View>

          <View className="gap-2">
            <Label>Max Budget (USD) *</Label>
            <Input
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
              placeholder="e.g. 50000"
              className="h-12 rounded-xl"
            />
          </View>

          <View className="gap-2">
            <Label>Preferred Condition</Label>
            <View className="flex-row gap-2 pt-1">
              {["New", "Pre-owned", "Any"].map((c) => (
                <Button
                  key={c}
                  variant={condition === c ? "default" : "outline"}
                  onPress={() => setCondition(c)}
                  className="flex-1 h-10 rounded-xl"
                >
                  <Text className={condition === c ? "text-primary-foreground font-semibold" : "text-muted-foreground"}>{c}</Text>
                </Button>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-8">
          <Button disabled={submitting} onPress={submit} className="h-14 w-full rounded-2xl">
            {submitting && <LoaderCircle size={18} color="#060606" className="mr-2" />}
            <Text className="text-base font-semibold text-primary-foreground">Submit Sourcing Request</Text>
          </Button>
          <Text className="mt-4 text-center text-xs text-muted-foreground">
            No commitment required. We'll get back to you with availability and pricing within 48 hours.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
