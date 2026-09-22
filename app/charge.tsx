import { useState } from "react";
import { Pressable, Text, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Zap, MapPin, Navigation, QrCode, BatteryCharging } from "lucide-react-native";
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
  },
];

export default function ChargeScreen() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Charge" subtitle="Find nearby stations" showBack />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Mock Map Area */}
        <Animated.View entering={FadeInDown.springify()} className="relative mx-5 mt-4 h-48 overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
          <View className="absolute inset-0 items-center justify-center bg-white/[0.02]">
            <MapPin size={32} color="#4d4d4d" />
            <Text className="mt-2 text-xs text-muted-foreground">Map view initializing...</Text>
          </View>
          {/* Faux map markers */}
          <View className="absolute left-10 top-10 h-8 w-8 items-center justify-center rounded-full bg-lime/20 border border-lime/50">
            <Zap size={14} color="#b3f835" />
          </View>
          <View className="absolute bottom-12 right-20 h-8 w-8 items-center justify-center rounded-full bg-lime/20 border border-lime/50">
            <Zap size={14} color="#b3f835" />
          </View>
        </Animated.View>

        <View className="px-5 mt-8">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Nearby Stations
          </Text>

          <View className="gap-3">
            {STATIONS.map((station, i) => (
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
                    <BatteryCharging size={20} color={station.status === "online" ? "#b3f835" : "#fafafa"} />
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
        <View className="h-12 w-12" /> {/* Spacer for balance */}
      </Animated.View>
    </View>
  );
}
