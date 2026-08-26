import { Image, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Bell,
  GraduationCap,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/use-profile";
import { VehicleCard } from "@/components/vehicle-card";
import type { Vehicle } from "@/lib/types";

function TopBar({ unread = 2 }: { unread?: number }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-5" style={{ paddingTop: Math.max(insets.top, 16) }}>
      <View className="w-10" />
      <View className="items-center">
        <Image source={require("../../assets/images/evee-logo.png")} style={{ height: 40, width: 140 }} resizeMode="contain" />
        <Text className="mt-1 font-display-black text-[10px] uppercase tracking-[3px] text-muted-foreground">
          One Ecosystem. <Text className="text-lime">Every Journey.</Text>
        </Text>
      </View>
      <Pressable
        onPress={() => router.push("/activity")}
        accessibilityLabel={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className="relative h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
      >
        <Bell size={18} color="#fafafa" strokeWidth={2} />
        {unread > 0 && <View className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-lime" />}
      </Pressable>
    </View>
  );
}

function WelcomeCard({ name, city, avatarUrl }: { name: string; city?: string; avatarUrl?: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-card px-4 py-3.5">
      <View className="min-w-0 flex-1">
        <Text className="text-xs text-muted-foreground">Welcome back</Text>
        <Text numberOfLines={1} className="mt-0.5 font-display-black text-2xl text-foreground">
          {name}
        </Text>
        {city && (
          <View className="mt-0.5 flex-row items-center">
            <View className="mr-1 h-1.5 w-1.5 rounded-full bg-lime" />
            <Text className="text-[11px] text-muted-foreground">{city}</Text>
          </View>
        )}
      </View>
      <Image
        source={avatarUrl ? { uri: avatarUrl } : require("../../assets/images/avatar-fallback.jpg")}
        style={{ height: 48, width: 48, borderRadius: 24, borderWidth: 2, borderColor: "rgba(179,248,53,0.7)" }}
      />
    </View>
  );
}

function HeroCard() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push("/explore")}
      accessibilityLabel="Find your EV — explore, compare and buy your next electric vehicle"
      className="overflow-hidden rounded-3xl border border-white/[0.06] bg-card"
    >
      <View className="relative min-h-[210px] flex-row">
        <View className="z-10 max-w-[58%] justify-between p-5">
          <View>
            <Text className="font-display-black text-[10px] uppercase tracking-[2px] text-lime">Featured</Text>
            <Text className="mt-2 font-display-black text-[26px] leading-[28px] text-foreground">Find Your EV</Text>
            <Text className="mt-2 text-[13px] leading-snug text-muted-foreground">
              Explore, compare and buy your next electric vehicle.
            </Text>
          </View>
          <View className="mt-4 h-11 w-11 items-center justify-center rounded-full bg-lime">
            <ArrowRight size={20} color="#060606" strokeWidth={2.4} />
          </View>
        </View>
        <Image
          source={require("../../assets/images/hero-ev.jpg")}
          style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "70%" }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(23,23,23,1)", "rgba(23,23,23,0.4)", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0.7, y: 0.5 }}
          style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "70%" }}
        />
      </View>
    </Pressable>
  );
}

const tiles: { label: string; hint: string; icon: LucideIcon; to: "/explore" | "/activity" | "/garage" }[] = [
  { label: "Finance", hint: "Flexible options", icon: Wallet, to: "/explore" },
  { label: "Charge", hint: "Find stations", icon: Zap, to: "/activity" },
  { label: "Service", hint: "Book & maintain", icon: Wrench, to: "/garage" },
  { label: "Insure", hint: "Protect your EV", icon: ShieldCheck, to: "/explore" },
  { label: "Learn", hint: "Grow your knowledge", icon: GraduationCap, to: "/activity" },
  { label: "Connect", hint: "People & community", icon: Users, to: "/activity" },
];

function EcosystemGrid() {
  const router = useRouter();
  return (
    <View className="flex-row flex-wrap gap-3">
      {tiles.map(({ label, hint, icon: Icon, to }) => (
        <Pressable
          key={label}
          onPress={() => router.push(to)}
          className="min-h-[92px] w-[47%] flex-row items-start gap-3 rounded-2xl border border-white/[0.06] bg-card p-4"
        >
          <View className="h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
            <Icon size={18} color="#b3f835" strokeWidth={2} />
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="font-display text-[15px] text-foreground">
              {label}
            </Text>
            <Text numberOfLines={1} className="mt-0.5 text-[11px] text-muted-foreground">
              {hint}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: recommended } = useQuery({
    queryKey: ["recommended"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, make, model, year, price, range_km, battery_kwh, acceleration_0_100, image_url, tagline")
        .order("price", { ascending: true })
        .limit(4);
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  const firstName = profile?.full_name?.split(" ")[0] ?? "Driver";
  const location = [profile?.city, profile?.country].filter(Boolean).join(", ") || undefined;

  return (
    <View className="flex-1 bg-background">
      <TopBar unread={2} />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-5 pt-4">
        <View className="gap-5">
          <WelcomeCard name={firstName} city={location} avatarUrl={profile?.avatar_url ?? undefined} />
          <HeroCard />
          <EcosystemGrid />
          <View className="pt-2">
            <View className="mb-3 flex-row items-end justify-between">
              <View>
                <Text className="font-display-black text-lg text-foreground">Picked for you</Text>
                <Text className="text-[11px] text-muted-foreground">Vehicles matched to your preferences</Text>
              </View>
              <Pressable onPress={() => router.push("/explore")}>
                <Text className="text-xs text-lime">See all</Text>
              </Pressable>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {recommended?.map((v) => (
                <View key={v.id} className="w-[47%]">
                  <VehicleCard v={v} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
