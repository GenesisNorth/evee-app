import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Animated, { FadeInDown } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { GitCompare, Search, SlidersHorizontal } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { VehicleCard } from "@/components/vehicle-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

const bodyTypes = ["all", "sedan", "suv", "hatchback", "pickup", "van"];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [bodyType, setBodyType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [minRange, setMinRange] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, make, model, year, price, range_km, battery_kwh, acceleration_0_100, image_url, tagline, body_type")
        .order("price");
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  const filtered = useMemo(() => {
    if (!vehicles) return [];
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (bodyType !== "all" && v.body_type !== bodyType) return false;
      if (v.price > maxPrice) return false;
      if (v.range_km < minRange) return false;
      if (!q) return true;
      return v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q);
    });
  }, [vehicles, query, bodyType, maxPrice, minRange]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingTop: Math.max(insets.top, 18), paddingBottom: 140 }}
        className="px-5"
      >
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime">Marketplace</Text>
            <Text className="font-display-black text-2xl text-foreground">Find your EV</Text>
          </View>
          <Pressable
            onPress={() => router.push("/compare")}
            accessibilityLabel="Compare vehicles"
            className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
          >
            <GitCompare size={16} color="#fafafa" />
          </Pressable>
        </View>

        <View className="mt-4 flex-row items-center gap-2">
          <View className="relative flex-1 justify-center">
            <View className="absolute left-3 z-10">
              <Search size={16} color="#9b9fa3" />
            </View>
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder="Search Tesla, BYD, MG…"
              className="h-11 rounded-xl pl-9"
            />
          </View>
          <Pressable
            onPress={() => setFiltersOpen((o) => !o)}
            className={cn(
              "h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]",
              filtersOpen && "border-primary/50 bg-primary/10",
            )}
          >
            <SlidersHorizontal size={16} color="#fafafa" />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          <View className="flex-row gap-2 pb-1">
            {bodyTypes.map((b) => (
              <Pressable
                key={b}
                onPress={() => setBodyType(b)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5",
                  bodyType === b ? "border-primary/60 bg-primary/15" : "border-white/10 bg-white/[0.03]",
                )}
              >
                <Text className={cn("text-xs font-semibold capitalize", bodyType === b ? "text-lime" : "text-muted-foreground")}>
                  {b}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {filtersOpen && (
          <View className="mt-3 gap-3 rounded-2xl border border-white/[0.06] bg-card p-4">
            <View>
              <View className="mb-1 flex-row justify-between">
                <Text className="text-xs text-muted-foreground">Max price</Text>
                <Text className="text-xs text-foreground">${maxPrice.toLocaleString()}</Text>
              </View>
              <Slider
                minimumValue={20000}
                maximumValue={200000}
                step={5000}
                value={maxPrice}
                onValueChange={setMaxPrice}
                minimumTrackTintColor="#b3f835"
                maximumTrackTintColor="rgba(255,255,255,0.15)"
                thumbTintColor="#b3f835"
              />
            </View>
            <View>
              <View className="mb-1 flex-row justify-between">
                <Text className="text-xs text-muted-foreground">Min range</Text>
                <Text className="text-xs text-foreground">{minRange} km</Text>
              </View>
              <Slider
                minimumValue={0}
                maximumValue={600}
                step={25}
                value={minRange}
                onValueChange={setMinRange}
                minimumTrackTintColor="#b3f835"
                maximumTrackTintColor="rgba(255,255,255,0.15)"
                thumbTintColor="#b3f835"
              />
            </View>
          </View>
        )}

        <Text className="mt-4 text-[11px] text-muted-foreground">
          {isLoading ? "Loading…" : `${filtered.length} vehicles`}
        </Text>
        <View className="mt-3 flex-row flex-wrap gap-3">
          {filtered.map((v, index) => (
            <Animated.View 
              key={v.id} 
              className="w-[47%]"
              entering={FadeInDown.delay(index * 100).springify()}
            >
              <VehicleCard v={v} />
            </Animated.View>
          ))}
        </View>

        <View className="mt-8 rounded-3xl border border-primary/20 bg-primary/10 p-6 items-center">
          <View className="h-12 w-12 rounded-full bg-primary/20 items-center justify-center mb-3">
            <Search size={24} color="#b3f835" />
          </View>
          <Text className="font-display-black text-xl text-foreground text-center">Can't find your EV?</Text>
          <Text className="mt-1 mb-5 text-center text-xs text-muted-foreground">
            Tell us exactly what you're looking for, and we'll source it for you through our partner network.
          </Text>
          <Pressable
            onPress={() => router.push("/sourcing")}
            className="h-12 px-8 rounded-xl bg-lime items-center justify-center"
          >
            <Text className="text-sm font-semibold text-primary-foreground">Source an EV</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
