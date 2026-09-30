import { useState } from "react";
import { useRouter } from "expo-router";
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
import { LoaderCircle, Zap, ArrowRight, Apple } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
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
  const router = useRouter();
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
    <View className="flex-1 bg-background">
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop" }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: "65%", opacity: 0.6 }}
        resizeMode="cover"
      />
      <LinearGradient 
        colors={['rgba(4,4,4,0)', '#040404', '#040404']}
        locations={[0, 0.5, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom + 24 }}
          className="px-6"
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.springify()} className="flex-1">
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

        <Pressable 
          onPress={() => router.replace("/(tabs)/explore")}
          className="mt-8 h-12 w-full rounded-xl bg-primary/20 border border-primary/40 items-center justify-center"
        >
          <Text className="font-display-black text-sm text-lime uppercase tracking-widest">Skip Login for Demo</Text>
        </Pressable>

            <View className="mt-12">
              <Text className="font-display-black text-4xl text-white">
                {mode === "signin" ? "Welcome\nBack." : "Join\nEVEE."}
              </Text>
              <Text className="mt-3 text-sm text-white/60 leading-5">
                {mode === "signin"
                  ? "Sign in to your electric journey and connect with the ecosystem."
                  : "Africa's electric mobility ecosystem, in one premium app."}
              </Text>
            </View>

        <View className="mt-8 gap-4">
          <View className="gap-1.5">
              <Label className="text-xs uppercase tracking-widest text-white/50 ml-1">Email</Label>
              <Input
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                className="h-14 rounded-2xl bg-white/[0.04] border-white/[0.08] text-white px-5"
                placeholder="you@example.com"
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
          </View>
          <View className="gap-1.5">
              <Label className="text-xs uppercase tracking-widest text-white/50 ml-1">Password</Label>
              <Input
                secureTextEntry
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChangeText={setPassword}
                className="h-14 rounded-2xl bg-white/[0.04] border-white/[0.08] text-white px-5"
                placeholder="At least 8 characters"
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
          </View>
            <Button disabled={submitting} onPress={handleSubmit} className="h-14 mt-4 w-full rounded-2xl flex-row items-center justify-between px-6 shadow-[0_0_20px_rgba(179,248,53,0.3)] border border-lime/50">
              {submitting ? (
                <LoaderCircle size={18} color="#060606" className="ml-auto mr-auto" />
              ) : (
                <>
                  <Text className="text-[15px] font-bold uppercase tracking-widest text-primary-foreground">
                    {mode === "signin" ? "Sign in" : "Create account"}
                  </Text>
                  <View className="h-8 w-8 rounded-full bg-[#060606]/10 items-center justify-center">
                    <ArrowRight size={16} color="#060606" strokeWidth={3} />
                  </View>
                </>
              )}
            </Button>
        </View>

        <View className="my-6 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-white/10" />
          <Text className="text-[11px] uppercase tracking-widest text-muted-foreground">or continue with</Text>
          <View className="h-px flex-1 bg-white/10" />
        </View>

        <View className="flex-row justify-center gap-4">
          <Button
            variant="outline"
            onPress={handleGoogle}
            disabled={googleLoading}
            className="h-14 w-14 rounded-full flex-row items-center justify-center bg-white/[0.03] border-white/10"
          >
            {googleLoading ? (
              <LoaderCircle size={20} color="#fafafa" />
            ) : (
              <GoogleIcon size={20} />
            )}
          </Button>

          <Button
            variant="outline"
            disabled={true}
            className="h-14 w-14 rounded-full flex-row items-center justify-center bg-white/[0.03] border-white/10"
          >
            <Apple size={20} color="#fafafa" />
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

          <View className="mt-auto flex-row items-center justify-center gap-2 pt-10 pb-4">
            <Zap size={12} color="#b3f835" />
            <Text className="text-[11px] uppercase tracking-widest text-white/40">Powered by clean energy.</Text>
          </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
