import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { PageHeader } from "@/components/page-header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { VehicleCard } from "@/components/vehicle-card";
import { Heart, ShoppingBag } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { Vehicle } from "@/lib/types";
import { useRouter } from "expo-router";

export default function FavoritesScreen() {
  const { user } = useSession();
  const router = useRouter();

  const { data: savedVehicles, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["saved-list", user?.id],
    queryFn: async () => {
      const { data: saved, error: err1 } = await supabase
        .from("saved_vehicles")
        .select("vehicle_id")
        .eq("user_id", user!.id);
      
      if (err1) throw err1;
      if (!saved || saved.length === 0) return [];

      const ids = saved.map(s => s.vehicle_id);

      const { data, error } = await supabase
        .from("vehicles")
        .select("id, make, model, year, price, range_km, battery_kwh, acceleration_0_100, image_url")
        .in("id", ids);

      if (error) throw error;
      return data as Vehicle[];
    },
  });

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Saved Vehicles" subtitle="Your personal showroom" showBack />
      
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#b3f835" />
          </View>
        ) : savedVehicles && savedVehicles.length > 0 ? (
          <View className="flex-row flex-wrap gap-3">
            {savedVehicles.map((v, index) => (
              <Animated.View 
                key={v.id} 
                className="w-[47%]"
                entering={FadeInDown.delay(index * 100).springify()}
              >
                <VehicleCard v={v} />
              </Animated.View>
            ))}
          </View>
        ) : (
          <Animated.View entering={FadeInDown} className="items-center py-20">
            <View className="h-24 w-24 rounded-full bg-white/5 items-center justify-center mb-6">
              <Heart size={40} color="#4d4d4d" />
            </View>
            <Text className="font-display-black text-2xl text-foreground text-center mb-2">No Saved Vehicles</Text>
            <Text className="text-sm text-muted-foreground text-center mb-8 px-8 leading-6">
              Tap the heart icon on any vehicle to add it to your personal showroom.
            </Text>
            <Pressable 
              onPress={() => router.replace("/(tabs)/explore")}
              className="h-12 px-8 rounded-xl bg-lime flex-row items-center justify-center gap-2"
            >
              <ShoppingBag size={16} color="#060606" />
              <Text className="font-display-black text-sm text-[#060606] uppercase tracking-widest">Explore Marketplace</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
