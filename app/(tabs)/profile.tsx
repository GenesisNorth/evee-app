import { useEffect, useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, MapPin, User, Zap } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useSession();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setCity(profile.city ?? "");
      setCountry(profile.country ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, city, country, phone })
        .eq("id", user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      Toast.show({ type: "success", text1: "Profile updated" });
    } catch (e) {
      Toast.show({ type: "error", text1: e instanceof Error ? e.message : "Failed" });
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingTop: Math.max(insets.top, 18), paddingBottom: 140 }}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-graphite" style={{ borderWidth: 2, borderColor: "rgba(179,248,53,0.7)" }}>
            <User size={28} color="#b3f835" />
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="font-display-black text-2xl text-foreground">
              {fullName || "Your profile"}
            </Text>
            <Text numberOfLines={1} className="text-[11px] text-muted-foreground">
              {user?.email}
            </Text>
            {(city || country) && (
              <View className="mt-0.5 flex-row items-center gap-1">
                <MapPin size={12} color="#b3f835" />
                <Text className="text-[11px] text-muted-foreground">{[city, country].filter(Boolean).join(", ")}</Text>
              </View>
            )}
          </View>
        </View>

        <View className="mt-6 gap-3">
          <Field label="Full name">
            <Input value={fullName} onChangeText={setFullName} />
          </Field>
          <Field label="Phone">
            <Input keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          </Field>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Field label="City">
                <Input value={city} onChangeText={setCity} />
              </Field>
            </View>
            <View className="flex-1">
              <Field label="Country">
                <Input value={country} onChangeText={setCountry} />
              </Field>
            </View>
          </View>
          <Button onPress={save} disabled={saving} className="h-12 w-full rounded-xl">
            <Text className="text-sm font-semibold text-primary-foreground">Save changes</Text>
          </Button>
        </View>

        <View className="mt-6 rounded-2xl border border-white/[0.06] bg-card p-4">
          <View className="flex-row items-center gap-2">
            <Zap size={12} color="#b3f835" />
            <Text className="text-[11px] uppercase tracking-widest text-muted-foreground">Preferences</Text>
          </View>
          <Text className="mt-2 text-sm text-muted-foreground">Manage your driving preferences and interests.</Text>
          <Button variant="outline" onPress={() => router.push("/onboarding")} className="mt-3 h-10 w-full rounded-xl">
            <Text className="text-sm font-semibold text-foreground">Update preferences</Text>
          </Button>
        </View>

        <Button
          variant="outline"
          onPress={signOut}
          className="mt-6 h-11 w-full rounded-xl border-destructive/40 bg-destructive/10"
        >
          <LogOut size={16} color="#ee343b" />
          <Text className="text-sm font-semibold text-destructive">Sign out</Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </View>
  );
}
