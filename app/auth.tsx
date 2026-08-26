import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoaderCircle, Zap } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle } from "@/lib/google-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/google-icon";

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit() {
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      Toast.show({ type: "error", text1: parsed.error.issues[0].message });
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        Toast.show({ type: "success", text1: "Welcome to EVEE" });
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
      }
    } catch (err) {
      Toast.show({ type: "error", text1: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      Toast.show({ type: "error", text1: err instanceof Error ? err.message : "Google sign-in failed" });
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: Math.max(insets.top, 40), paddingBottom: insets.bottom + 24 }}
        className="px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center pt-6">
          <Image
            source={require("../assets/images/evee-logo.png")}
            style={{ height: 44, width: 140 }}
            resizeMode="contain"
          />
          <Text className="mt-2 font-display-black text-[10px] uppercase tracking-[3px] text-muted-foreground">
            One Ecosystem. <Text className="text-lime">Every Journey.</Text>
          </Text>
        </View>

        <View className="mt-10">
          <Text className="font-display-black text-3xl text-foreground">
            {mode === "signin" ? "Welcome back" : "Join EVEE"}
          </Text>
          <Text className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to your electric journey."
              : "Africa's electric mobility ecosystem, in one app."}
          </Text>
        </View>

        <Button
          variant="outline"
          onPress={handleGoogle}
          disabled={googleLoading}
          className="mt-8 h-12 w-full flex-row items-center justify-center gap-2 rounded-xl"
        >
          {googleLoading ? (
            <LoaderCircle size={16} color="#fafafa" />
          ) : (
            <GoogleIcon size={16} />
          )}
          <Text className="text-sm font-semibold text-foreground">Continue with Google</Text>
        </Button>

        <View className="my-6 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-white/10" />
          <Text className="text-[11px] uppercase tracking-widest text-muted-foreground">or</Text>
          <View className="h-px flex-1 bg-white/10" />
        </View>

        <View className="gap-4">
          <View className="gap-1.5">
            <Label>Email</Label>
            <Input
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              className="h-12 rounded-xl"
              placeholder="you@example.com"
            />
          </View>
          <View className="gap-1.5">
            <Label>Password</Label>
            <Input
              secureTextEntry
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChangeText={setPassword}
              className="h-12 rounded-xl"
              placeholder="At least 8 characters"
            />
          </View>
          <Button disabled={submitting} onPress={handleSubmit} className="h-12 w-full rounded-xl">
            {submitting ? (
              <LoaderCircle size={16} color="#060606" />
            ) : (
              <Zap size={16} color="#060606" />
            )}
            <Text className="text-sm font-semibold text-primary-foreground">
              {mode === "signin" ? "Sign in" : "Create account"}
            </Text>
          </Button>
        </View>

        <Pressable
          onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 items-center"
        >
          <Text className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Don't have an account? <Text className="text-lime">Sign up</Text>
              </>
            ) : (
              <>
                Already have an account? <Text className="text-lime">Sign in</Text>
              </>
            )}
          </Text>
        </Pressable>

        <View className="mt-auto flex-row items-center justify-center gap-2 pt-10">
          <Zap size={12} color="#b3f835" />
          <Text className="text-[11px] text-muted-foreground">Powered by clean African energy.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
