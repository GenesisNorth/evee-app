import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Battery, Gauge, Zap, type LucideIcon } from "lucide-react-native";
import { formatCurrency } from "@/lib/format";
import type { Vehicle } from "@/lib/types";
import { SaveButton } from "@/components/save-button";
import { VehicleImage } from "@/components/vehicle-image";

type VehicleCardData = Pick<
  Vehicle,
  "id" | "make" | "model" | "price" | "range_km" | "battery_kwh" | "acceleration_0_100" | "image_url"
>;

export function VehicleCard({ v }: { v: VehicleCardData }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/vehicle/${v.id}`)}
      className="overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
      style={({ pressed }) => pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }}
    >
      <View className="relative">
        <VehicleImage
          src={v.image_url}
          alt={`${v.make} ${v.model}`}
          seed={`${v.make}${v.model}`}
          className="aspect-[16/10] w-full"
        />
        <View className="absolute right-2 top-2">
          <SaveButton vehicleId={v.id} />
        </View>
      </View>
      <View className="p-4">
        <View className="flex-row items-start justify-between gap-2">
          <View className="min-w-0 flex-1">
            <Text className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {v.make}
            </Text>
            <Text numberOfLines={1} className="mt-0.5 font-display text-lg text-foreground">
              {v.model}
            </Text>
          </View>
          <Text className="font-display-black text-base text-lime">{formatCurrency(v.price)}</Text>
        </View>
        <View className="mt-3 flex-row items-center justify-between">
          <Stat icon={Gauge} value={`${v.range_km}km`} />
          <Stat icon={Battery} value={`${v.battery_kwh}kWh`} />
          <Stat icon={Zap} value={`${v.acceleration_0_100}s`} />
        </View>
      </View>
    </Pressable>
  );
}

function Stat({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <Icon size={12} color="#b3f835" />
      <Text className="text-[11px] text-muted-foreground">{value}</Text>
    </View>
  );
}
