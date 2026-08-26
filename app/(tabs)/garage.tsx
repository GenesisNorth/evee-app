import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Battery, Car, Gauge, Heart } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleImage } from "@/components/vehicle-image";
import type { GarageVehicle, Vehicle } from "@/lib/types";

export default function GarageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useSession();

  const { data: saved } = useQuery({
    enabled: !!user,
    queryKey: ["saved-list", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("saved_vehicles")
        .select("vehicle:vehicles(id, make, model, year, price, range_km, battery_kwh, acceleration_0_100, image_url, tagline)")
        .eq("user_id", user!.id);
      return ((data ?? []) as unknown as { vehicle: Vehicle | null }[]).map((r) => r.vehicle).filter(Boolean) as Vehicle[];
    },
  });

  const { data: owned } = useQuery({
    enabled: !!user,
    queryKey: ["garage", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("garage_vehicles")
        .select("id, nickname, odometer_km, battery_pct, status, vehicle:vehicles(id, make, model, image_url)")
        .eq("user_id", user!.id);
      return (data ?? []) as unknown as GarageVehicle[];
    },
  });

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingTop: Math.max(insets.top, 18), paddingBottom: 140 }} className="px-5">
        <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime">Your fleet</Text>
        <Text className="font-display-black text-2xl text-foreground">My Garage</Text>

        <View className="mt-5">
          <View className="mb-3 flex-row items-center gap-2">
            <Car size={14} color="#9b9fa3" />
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Owned</Text>
          </View>
          {owned && owned.length > 0 ? (
            <View className="gap-3">
              {owned.map((g) => (
                <View key={g.id} className="flex-row gap-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-3">
                  <VehicleImage
                    src={g.vehicle?.image_url}
                    alt=""
                    seed={(g.vehicle?.make ?? "") + (g.vehicle?.model ?? "")}
                    className="h-20 w-28 overflow-hidden rounded-xl"
                  />
                  <View className="min-w-0 flex-1">
                    <Text className="text-[10px] uppercase tracking-widest text-muted-foreground">{g.vehicle?.make}</Text>
                    <Text numberOfLines={1} className="font-display-black text-base text-foreground">
                      {g.nickname ?? g.vehicle?.model}
                    </Text>
                    <View className="mt-2 flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <Battery size={12} color="#b3f835" />
                        <Text className="text-[11px] text-muted-foreground">{g.battery_pct}%</Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Gauge size={12} color="#b3f835" />
                        <Text className="text-[11px] text-muted-foreground">{g.odometer_km.toLocaleString()} km</Text>
                      </View>
                      <View className="rounded-full bg-primary/15 px-2 py-0.5">
                        <Text className="text-[10px] uppercase text-lime">{g.status}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-2xl border border-white/[0.06] bg-card p-5">
              <Text className="text-center text-sm text-muted-foreground">
                No vehicles yet. Reserve one from the marketplace and it will show up here.
              </Text>
            </View>
          )}
        </View>

        <View className="mt-6">
          <View className="mb-3 flex-row items-center gap-2">
            <Heart size={14} color="#9b9fa3" />
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Saved</Text>
          </View>
          {saved && saved.length > 0 ? (
            <View className="flex-row flex-wrap gap-3">
              {saved.map((v) => (
                <View key={v.id} className="w-[47%]">
                  <VehicleCard v={v} />
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-2xl border border-white/[0.06] bg-card p-5">
              <Text className="text-center text-sm text-muted-foreground">
                Tap the heart on any vehicle to save it here.{" "}
                <Text className="text-lime" onPress={() => router.push("/explore")}>
                  Browse marketplace
                </Text>
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
