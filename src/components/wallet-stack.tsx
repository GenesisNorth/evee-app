// Cache bust
import { useState } from "react";
import { View, Text, Pressable, Image, StyleSheet, Dimensions } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  interpolate,
  useDerivedValue,
  withSequence
} from "react-native-reanimated";
import { Battery, Key, Lock, Unlock, Zap, Gauge } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 200;
const COLLAPSED_OFFSET = 20;
const EXPANDED_OFFSET = CARD_HEIGHT + 20;

const MY_FLEET = [
  {
    id: "1",
    model: "Tesla Model Y",
    trim: "Long Range",
    battery: 84,
    range: 412,
    image: require("../../assets/images/hero-ev.jpg"),
    color: "#1e1e1e"
  },
  {
    id: "2",
    model: "Porsche Taycan",
    trim: "Turbo S",
    battery: 100,
    range: 350,
    image: require("../../assets/images/hero-ev.jpg"),
    color: "#0a2540"
  },
  {
    id: "3",
    model: "BYD Seal",
    trim: "Performance",
    battery: 72,
    range: 520,
    image: require("../../assets/images/hero-ev.jpg"),
    color: "#2d1b4e"
  }
];

interface WalletCardProps {
  vehicle: typeof MY_FLEET[0];
  index: number;
  totalCards: number;
  isExpanded: boolean;
  onPress: () => void;
  isActive: boolean;
}

function WalletCard({ vehicle, index, totalCards, isExpanded, onPress, isActive }: WalletCardProps) {
  const [locked, setLocked] = useState(true);
  const router = useRouter();

  // Derived value for smooth transitions
  const progress = useDerivedValue(() => {
    return withSpring(isExpanded ? 1 : 0, { damping: 15, stiffness: 100 });
  });

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [index * COLLAPSED_OFFSET, index * EXPANDED_OFFSET]
    );

    const scale = interpolate(
      progress.value,
      [0, 1],
      [1 - (totalCards - 1 - index) * 0.05, 1]
    );

    const opacity = interpolate(
      progress.value,
      [0, 1],
      [1 - (totalCards - 1 - index) * 0.2, 1]
    );

    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: index,
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[animatedStyle, { height: CARD_HEIGHT }]}>
      <Pressable 
        onPress={onPress}
        className="w-full h-full rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl"
        style={{ backgroundColor: vehicle.color }}
      >
        <Image 
          source={vehicle.image} 
          style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.6 }} 
          resizeMode="cover" 
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.9)']}
          style={StyleSheet.absoluteFill}
        />
        
        <View className="flex-1 justify-between p-5">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="font-display-black text-2xl text-white">{vehicle.model}</Text>
              <Text className="text-xs font-semibold uppercase tracking-widest text-lime">{vehicle.trim}</Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-center gap-1.5">
                <Battery size={16} color={vehicle.battery > 20 ? "#b3f835" : "#ee343b"} />
                <Text className="font-display-black text-xl text-white">{vehicle.battery}%</Text>
              </View>
              <Text className="text-xs text-neutral-400">Range: {vehicle.range} km</Text>
            </View>
          </View>

          {/* Quick Actions (only really usable when expanded or at top of stack) */}
          <View className="flex-row justify-between items-end">
            <View className="flex-row gap-3">
              <Pressable 
                onPress={(e) => { e.stopPropagation(); setLocked(!locked); }}
                className="h-12 w-12 rounded-full bg-white/20 items-center justify-center backdrop-blur-md border border-white/10"
              >
                {locked ? <Lock size={20} color="#fafafa" /> : <Unlock size={20} color="#b3f835" />}
              </Pressable>
              <Pressable 
                onPress={(e) => e.stopPropagation()}
                className="h-12 w-12 rounded-full bg-white/20 items-center justify-center backdrop-blur-md border border-white/10"
              >
                <Zap size={20} color="#fafafa" />
              </Pressable>
            </View>
            
            <Pressable onPress={(e) => { e.stopPropagation(); router.push("/battery-health"); }} className="h-10 px-4 rounded-full bg-lime items-center justify-center">
              <Text className="font-semibold text-[#060606] text-xs">Manage</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function WalletStack() {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerHeight = useDerivedValue(() => {
    const targetHeight = isExpanded 
      ? CARD_HEIGHT + (MY_FLEET.length - 1) * EXPANDED_OFFSET
      : CARD_HEIGHT + (MY_FLEET.length - 1) * COLLAPSED_OFFSET;
    return withSpring(targetHeight, { damping: 15, stiffness: 100 });
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: containerHeight.value,
    };
  });

  return (
    <Animated.View className="w-full relative" style={containerStyle}>
      <View className="flex-row justify-between items-end mb-4 absolute -top-10 left-0 right-0 z-50">
        <Text className="font-display-black text-lg text-foreground">Virtual Garage</Text>
        <Pressable onPress={() => setIsExpanded(!isExpanded)}>
          <Text className="text-xs font-semibold text-lime">
            {isExpanded ? "Collapse Stack" : "View All"}
          </Text>
        </Pressable>
      </View>

      <View className="relative w-full h-full mt-4">
        {MY_FLEET.map((vehicle, index) => (
          <WalletCard
            key={vehicle.id}
            vehicle={vehicle}
            index={index}
            totalCards={MY_FLEET.length}
            isExpanded={isExpanded}
            isActive={index === MY_FLEET.length - 1} // Top card
            onPress={() => setIsExpanded(!isExpanded)}
          />
        ))}
      </View>
    </Animated.View>
  );
}
