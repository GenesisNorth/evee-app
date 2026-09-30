// Cache bust
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
  Users,
  Wallet,
  Wrench,
  Zap,
  ShieldCheck,
  Calculator,
  type LucideIcon,
} from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/use-profile";
import { VehicleCard } from "@/components/vehicle-card";
import { WalletStack } from "@/components/wallet-stack";
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

const tiles: { label: string; hint: string; icon: LucideIcon; to: any }[] = [
  { label: "Finance", hint: "Flexible options", icon: Wallet, to: "/finance-portal" },
  { label: "Charge", hint: "Find stations", icon: Zap, to: "/charge" },
  { label: "Service", hint: "Book & maintain", icon: Wrench, to: "/service" },
  { label: "Learn", hint: "Grow your knowledge", icon: GraduationCap, to: "/learn" },
  { label: "Connect", hint: "People & community", icon: Users, to: "/connect" },
  { label: "Calculator", hint: "Savings vs Petrol", icon: Calculator, to: "/calculator" },
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

  const firstName = profile?.full_name?.split(" ")[0] ?? "Genesis";
  const location = [profile?.city, profile?.country].filter(Boolean).join(", ") || undefined;

  return (
    <View className="flex-1 bg-background">
      <TopBar unread={2} />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-5 pt-4">
        <View className="gap-5">
          <WelcomeCard name={firstName} city={location} avatarUrl={profile?.avatar_url ?? undefined} />
          
          <View className="mt-12 mb-4 z-50">
            <WalletStack />
          </View>
          
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
          <JournalPreviewsSection />
        </View>
      </ScrollView>
    </View>
  );
}

function JournalPreviewsSection() {
  const router = useRouter();
  const articles = [
    {
      tag: "Guide",
      title: "EV Charging at Home: The Complete Setup",
      desc: "Everything you need to know about installing a Level 2 charger, costs, and getting the best overnight charge.",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop",
    },
    {
      tag: "Insights",
      title: "Total Cost of Ownership: EV vs Petrol",
      desc: "We break down fuel, maintenance, and depreciation over 5 years to show why EVs save you more.",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1620804470550-93a0058b4bce?q=80&w=800&auto=format&fit=crop",
    },
    {
      tag: "News",
      title: "Nigeria's EV Policy: What It Means for You",
      desc: "New import duty exemptions and charging infrastructure plans could make 2026 the year of the EV in Nigeria.",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1660662243734-716b1e6ce48e?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <View className="mt-2">
      <View className="mb-3 flex-row items-end justify-between">
        <View>
          <Text className="font-display-black text-lg text-foreground">EVEE Journal</Text>
          <Text className="text-[11px] text-muted-foreground">Latest guides and insights</Text>
        </View>
        <Pressable onPress={() => router.push("/learn")}>
          <Text className="text-xs text-lime">Read more</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
        {articles.map((article, i) => {
          return (
            <Pressable key={i} onPress={() => router.push(`/article/${i + 1}`)} className={`w-[260px] rounded-2xl border border-white/[0.06] bg-card overflow-hidden ${i < articles.length - 1 ? "mr-4" : ""}`}>
              <Image source={{ uri: article.image }} className="h-[100px] w-full" style={{ resizeMode: "cover" }} />
              <View className="p-4">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-lime">{article.tag}</Text>
                  <Text className="text-[10px] text-muted-foreground">{article.readTime}</Text>
                </View>
                <Text className="font-display text-sm text-foreground">{article.title}</Text>
                <Text className="mt-1 text-[11px] text-muted-foreground leading-4" numberOfLines={2}>{article.desc}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
