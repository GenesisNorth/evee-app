import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { VehicleImage } from "@/components/vehicle-image";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

const rows: [string, (v: Vehicle) => string][] = [
  ["Price", (v) => formatCurrency(Number(v.price))],
  ["Range", (v) => `${v.range_km} km`],
  ["Battery", (v) => `${v.battery_kwh} kWh`],
  ["0–100", (v) => `${v.acceleration_0_100}s`],
  ["Top speed", (v) => `${v.top_speed_kph} km/h`],
  ["Charge time", (v) => `${v.charge_time_hours}h`],
  ["Seats", (v) => String(v.seats)],
  ["Drive", (v) => v.drivetrain],
];

export default function CompareScreen() {
  const params = useLocalSearchParams();
  const initialIds = typeof params.ids === "string" ? params.ids.split(",") : [];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const { data: vehicles } = useQuery({
    queryKey: ["vehicles-compare"],
    queryFn: async () => {
      const { data } = await supabase.from("vehicles").select("*").order("make");
      return (data ?? []) as Vehicle[];
    },
  });

  const selected = (vehicles ?? []).filter((v) => selectedIds.includes(v.id)).slice(0, 3);

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Compare EVs" subtitle="Pick up to 3 vehicles" showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-5">
        <View className="flex-row gap-2">
          {[0, 1, 2].map((slot) => {
            const v = selected[slot];
            return (
              <View key={slot} className="flex-1 items-center rounded-2xl border border-white/[0.06] bg-card p-2">
                {v ? (
                  <>
                    <VehicleImage src={v.image_url} alt={v.model} seed={v.make + v.model} className="aspect-[4/3] w-full overflow-hidden rounded-xl" />
                    <Text className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">{v.make}</Text>
                    <Text numberOfLines={1} className="font-display-black text-xs text-foreground">{v.model}</Text>
                    <Pressable
                      onPress={() => setSelectedIds(selectedIds.filter((id) => id !== v.id))}
                      className="mt-1 flex-row items-center gap-1"
                    >
                      <X size={12} color="#9b9fa3" />
                      <Text className="text-[10px] text-muted-foreground">Remove</Text>
                    </Pressable>
                  </>
                ) : (
                  <View className="aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-white/10">
                    <Plus size={20} color="#9b9fa3" />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {selected.length > 0 && (
          <View className="mt-5 overflow-hidden rounded-2xl border border-white/[0.06]">
            {rows.map(([label, render], i) => (
              <View key={label} className={cn("flex-row px-3 py-2", i % 2 === 0 && "bg-white/[0.02]")}>
                <Text className="flex-1 text-xs text-muted-foreground">{label}</Text>
                {[0, 1, 2].map((slot) => (
                  <Text key={slot} className="flex-1 font-display-black text-sm text-foreground">
                    {selected[slot] ? render(selected[slot]) : "—"}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        <View className="mt-6">
          <Text className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">Add vehicle</Text>
          <View className="flex-row flex-wrap gap-2">
            {vehicles
              ?.filter((v) => !selectedIds.includes(v.id))
              .slice(0, 6)
              .map((v) => (
                <Pressable
                  key={v.id}
                  disabled={selected.length >= 3}
                  onPress={() => setSelectedIds([...selectedIds, v.id])}
                  className={cn(
                    "w-[47%] flex-row items-center gap-2 rounded-xl border border-white/[0.06] bg-card p-2",
                    selected.length >= 3 && "opacity-40",
                  )}
                >
                  <VehicleImage src={v.image_url} alt="" seed={v.make + v.model} className="h-10 w-14 overflow-hidden rounded-md" />
                  <View className="min-w-0 flex-1">
                    <Text numberOfLines={1} className="text-[10px] uppercase tracking-widest text-muted-foreground">{v.make}</Text>
                    <Text numberOfLines={1} className="font-display-black text-xs text-foreground">{v.model}</Text>
                  </View>
                </Pressable>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
