import { useState } from "react";
import { Pressable, Text, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Zap, MapPin, Navigation, QrCode, BatteryCharging, Sun, ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const STATIONS = [
  {
    id: "1",
    name: "Evee Hub VI",
    address: "14 Adetokunbo Ademola St, Victoria Island",
    distance: "1.2 km",
    available: 4,
    total: 6,
    power: "150kW DC",
    status: "online",
    type: "electric",
  },
  {
    id: "2",
    name: "Lekki Phase 1 Supercharger",
    address: "Admiralty Way, Lekki",
    distance: "3.5 km",
    available: 2,
    total: 4,
    power: "120kW DC",
    status: "online",
    type: "electric",
  },
  {
    id: "3",
    name: "Ikeja City Mall Fast Charge",
    address: "Obafemi Awolowo Way, Ikeja",
    distance: "12.8 km",
    available: 0,
    total: 2,
    power: "50kW DC",
    status: "busy",
    type: "electric",
  },
  {
    id: "4",
    name: "SunPower Lekki Array",
    address: "Freedom Way, Lekki",
    distance: "2.1 km",
    available: 2,
    total: 2,
    power: "25kW Solar",
    status: "online",
    type: "solar",
  },
  {
    id: "5",
    name: "EcoCharge Yaba",
    address: "Herbert Macaulay Way, Yaba",
    distance: "8.4 km",
    available: 1,
    total: 4,
    power: "50kW Solar",
    status: "online",
    type: "solar",
  }
];

export default function ChargeScreen() {
  const router = useRouter();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [chargeType, setChargeType] = useState<"electric" | "solar">("electric");

  const filteredStations = STATIONS.filter(s => s.type === chargeType);

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Charge" subtitle="Find nearby stations" showBack />
      
      <View className="px-5 mt-2 flex-row rounded-xl border border-white/10 bg-white/[0.03] p-1">
        <Pressable onPress={() => setChargeType('electric')} className={cn("flex-1 items-center justify-center rounded-lg py-2", chargeType === 'electric' ? "bg-primary/20" : "")}>
          <Text className={cn("text-xs font-semibold", chargeType === 'electric' ? "text-lime" : "text-muted-foreground")}>Electric</Text>
        </Pressable>
        <Pressable onPress={() => setChargeType('solar')} className={cn("flex-1 items-center justify-center rounded-lg py-2", chargeType === 'solar' ? "bg-primary/20" : "")}>
          <Text className={cn("text-xs font-semibold", chargeType === 'solar' ? "text-lime" : "text-muted-foreground")}>Solar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {chargeType === "solar" ? (
          <Animated.View entering={FadeInDown} className="mx-5 mt-4 overflow-hidden rounded-3xl border border-primary/40 bg-primary/10">
            <View className="p-6">
              <Sun size={32} color="#b3f835" className="mb-3" />
              <Text className="font-display-black text-2xl text-foreground mb-2">Home Solar Setup</Text>
              <Text className="text-sm text-muted-foreground leading-5 mb-6">
                Power your EV and your entire home with clean, renewable energy. Get a free site review and estimate today.
              </Text>
              <Pressable 
                onPress={() => router.push("/solar-setup")}
                className="h-12 rounded-xl bg-lime flex-row items-center justify-center gap-2"
              >
                <Text className="font-display-black text-sm text-[#060606] uppercase tracking-widest">Get a Quote</Text>
                <ArrowRight size={16} color="#060606" strokeWidth={3} />
              </Pressable>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.springify()} className="relative mx-5 mt-4 h-48 overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
            <View className="absolute inset-0 items-center justify-center bg-white/[0.02]">
              <MapPin size={32} color="#4d4d4d" />
              <Text className="mt-2 text-xs text-muted-foreground">Map view initializing...</Text>
            </View>
            <View className="absolute left-10 top-10 h-8 w-8 items-center justify-center rounded-full bg-lime/20 border border-lime/50">
              <Zap size={14} color="#b3f835" />
            </View>
            <View className="absolute bottom-12 right-20 h-8 w-8 items-center justify-center rounded-full bg-lime/20 border border-lime/50">
              <Zap size={14} color="#b3f835" />
            </View>
          </Animated.View>
        )}

        <View className="px-5 mt-8">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Nearby Stations
          </Text>

          <View className="gap-3">
            {filteredStations.map((station, i) => (
              <Animated.View key={station.id} entering={FadeInDown.delay(i * 100).springify()}>
                <Pressable
                  onPress={() => setSelectedStation(station.id)}
                  className={cn(
                    "flex-row items-center rounded-2xl border p-4",
                    selectedStation === station.id 
                      ? "border-primary bg-primary/10" 
                      : "border-white/10 bg-card"
                  )}
                >
                  <View className={cn(
                    "h-12 w-12 items-center justify-center rounded-xl",
                    station.status === "online" ? "bg-lime/20" : "bg-white/10"
                  )}>
                    {chargeType === "electric" 
                      ? <BatteryCharging size={20} color={station.status === "online" ? "#b3f835" : "#fafafa"} />
                      : <Sun size={20} color={station.status === "online" ? "#b3f835" : "#fafafa"} />
                    }
                  </View>
                  
                  <View className="ml-4 flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-display-black text-sm text-foreground">{station.name}</Text>
                      <Text className="text-xs font-semibold text-lime">{station.distance}</Text>
                    </View>
                    <Text className="mt-1 text-xs text-muted-foreground" numberOfLines={1}>{station.address}</Text>
                    
                    <View className="mt-2 flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <View className={cn("h-1.5 w-1.5 rounded-full", station.available > 0 ? "bg-lime" : "bg-red-500")} />
                        <Text className="text-[10px] text-muted-foreground">
                          {station.available}/{station.total} available
                        </Text>
                      </View>
                      <Text className="text-[10px] font-semibold text-foreground bg-white/10 px-1.5 py-0.5 rounded-md">
                        {station.power}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <Animated.View 
        entering={FadeInUp.springify()}
        className="absolute bottom-8 left-5 right-5 overflow-hidden rounded-full bg-lime flex-row items-center p-2 shadow-xl"
      >
        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#060606]">
          <QrCode size={20} color="#b3f835" />
        </View>
        <Text className="flex-1 text-center font-display-black text-sm text-[#060606]">SCAN TO CHARGE</Text>
        <View className="h-12 w-12" />
      </Animated.View>
    </View>
  );
}
