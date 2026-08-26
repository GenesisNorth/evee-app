import { useState, type ComponentType } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Battery,
  Check,
  Clock,
  Gauge,
  LoaderCircle,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
  type LucideProps,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { formatCurrency, monthlyPayment } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { SaveButton } from "@/components/save-button";
import { VehicleImage } from "@/components/vehicle-image";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/lib/types";

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [reserving, setReserving] = useState(false);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Vehicle not found");
      return data as Vehicle;
    },
  });

  const { data: alreadyReserved } = useQuery({
    enabled: !!user && !!id,
    queryKey: ["garage-status", user?.id, id],
    queryFn: async () => {
      const { data } = await supabase
        .from("garage_vehicles")
        .select("id")
        .eq("user_id", user!.id)
        .eq("vehicle_id", id!)
        .maybeSingle();
      return !!data;
    },
  });

  async function reserve() {
    if (!user || !vehicle || alreadyReserved) return;
    setReserving(true);
    try {
      const { error } = await supabase.from("garage_vehicles").insert({
        user_id: user.id,
        vehicle_id: vehicle.id,
        odometer_km: 0,
        battery_pct: 100,
        status: "reserved",
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["garage"] });
      queryClient.invalidateQueries({ queryKey: ["garage-status"] });
      Toast.show({ type: "success", text1: "Reserved! Find it in your Garage." });
      router.push("/garage");
    } catch (e) {
      Toast.show({ type: "error", text1: e instanceof Error ? e.message : "Could not reserve" });
    } finally {
      setReserving(false);
    }
  }

  if (isLoading || !vehicle) {
    return (
      <View className="flex-1 bg-background">
        <PageHeader title="Loading…" showBack />
      </View>
    );
  }

  const estMonthly = monthlyPayment(Number(vehicle.price), Number(vehicle.price) * 0.2, 60);

  return (
    <View className="flex-1 bg-background">
      <PageHeader
        title={`${vehicle.make} ${vehicle.model}`}
        subtitle={`${vehicle.year} · ${vehicle.body_type.toUpperCase()}`}
        showBack
        right={<SaveButton vehicleId={vehicle.id} />}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-5">
        <VehicleImage
          src={vehicle.image_url}
          alt={`${vehicle.make} ${vehicle.model}`}
          seed={`${vehicle.make}${vehicle.model}`}
          className="aspect-[16/10] w-full overflow-hidden rounded-3xl"
        />

        <View className="mt-5 flex-row items-end justify-between">
          <View>
            <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime">
              {vehicle.tagline ?? "Electric"}
            </Text>
            <Text className="mt-1 font-display-black text-2xl text-foreground">{formatCurrency(Number(vehicle.price))}</Text>
            <Text className="text-[11px] text-muted-foreground">or ~{formatCurrency(estMonthly)}/mo · 60 mo</Text>
          </View>
          <View className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1">
            <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime">
              {vehicle.is_new ? "New" : "Certified"}
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row flex-wrap gap-3">
          <SpecCard icon={Gauge} label="Range" value={`${vehicle.range_km} km`} />
          <SpecCard icon={Battery} label="Battery" value={`${vehicle.battery_kwh} kWh`} />
          <SpecCard icon={Zap} label="0–100 km/h" value={`${vehicle.acceleration_0_100}s`} />
          <SpecCard icon={Clock} label="Charge" value={`${vehicle.charge_time_hours}h`} />
          <SpecCard icon={Users} label="Seats" value={String(vehicle.seats)} />
          <SpecCard icon={Zap} label="Top speed" value={`${vehicle.top_speed_kph} km/h`} />
        </View>

        {vehicle.description && (
          <View className="mt-5 rounded-2xl border border-white/[0.06] bg-card p-4">
            <Text className="text-sm text-muted-foreground">{vehicle.description}</Text>
          </View>
        )}

        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={() => router.push(`/finance/${vehicle.id}`)}
            className="flex-1 gap-1 rounded-2xl border border-white/[0.06] bg-card p-4"
          >
            <Wallet size={20} color="#b3f835" />
            <Text className="font-display text-sm text-foreground">Apply for finance</Text>
            <Text className="text-[10px] text-muted-foreground">Get pre-qualified</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push(`/insure/${vehicle.id}`)}
            className="flex-1 gap-1 rounded-2xl border border-white/[0.06] bg-card p-4"
          >
            <ShieldCheck size={20} color="#b3f835" />
            <Text className="font-display text-sm text-foreground">Get insured</Text>
            <Text className="text-[10px] text-muted-foreground">Instant quotes</Text>
          </Pressable>
        </View>

        <View className="mt-6">
          <Button
            onPress={reserve}
            disabled={reserving || alreadyReserved}
            className="h-12 w-full rounded-xl"
          >
            {reserving ? (
              <LoaderCircle size={16} color="#060606" />
            ) : alreadyReserved ? (
              <Check size={16} color="#060606" />
            ) : null}
            <Text className="text-sm font-semibold text-primary-foreground">
              {alreadyReserved ? "Reserved" : "Reserve this EV"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

function SpecCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<LucideProps>;
  label: string;
  value: string;
}) {
  return (
    <View className="w-[31%] gap-2 rounded-2xl border border-white/[0.06] bg-card p-3">
      <Icon size={16} color="#b3f835" />
      <Text className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Text>
      <Text className="font-display-black text-sm text-foreground">{value}</Text>
    </View>
  );
}
