import { View, Pressable, Text, StyleSheet } from "react-native";
import { Tabs, type BottomTabBarProps } from "expo-router/js-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Car, House, Store, User, type LucideIcon } from "lucide-react-native";
import { cn } from "@/lib/utils";

const iconFor: Record<string, LucideIcon> = {
  index: House,
  explore: Store,
  garage: Car,
  profile: User,
};
const labelFor: Record<string, string> = {
  index: "Home",
  explore: "Marketplace",
  garage: "Garage",
  profile: "Profile",
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute inset-x-0 bottom-0 px-5"
      style={{ paddingBottom: Math.max(insets.bottom, 14) + 8 }}
      pointerEvents="box-none"
    >
      {/* Shadow lives on this outer, non-clipping view — BlurView below clips its
          corners with overflow:hidden, which would otherwise cut the shadow off. */}
      <View
        className="mx-auto w-full max-w-[480px]"
        style={{
          borderRadius: 28,
          shadowColor: "#000",
          shadowOpacity: 0.45,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 14 },
          elevation: 16,
        }}
      >
        <BlurView
          intensity={65}
          tint="dark"
          blurMethod="dimezisBlurView"
          className="flex-row overflow-hidden border border-white/[0.14] px-2 py-2"
          style={{ borderRadius: 28, backgroundColor: "rgba(16,16,16,0.4)" }}
        >
          {/* Glass sheen — a soft highlight catching the top edge, purely decorative */}
          <LinearGradient
            colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {state.routes.map((route, index) => {
            const isActive = state.index === index;
            const Icon = iconFor[route.name] ?? House;
            const label = labelFor[route.name] ?? route.name;
            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
                  if (!isActive && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                className="mx-auto flex-1 items-center justify-center gap-1 rounded-2xl px-2 py-1.5"
                style={({ pressed }) => pressed && { opacity: 0.6 }}
              >
                <View
                  className={cn("h-8 w-8 items-center justify-center rounded-full", isActive ? "bg-lime" : "")}
                  style={
                    isActive
                      ? {
                          shadowColor: "#b3f835",
                          shadowOpacity: 0.6,
                          shadowRadius: 10,
                          shadowOffset: { width: 0, height: 2 },
                          elevation: 6,
                        }
                      : undefined
                  }
                >
                  <Icon size={18} color={isActive ? "#060606" : "#c9cbce"} strokeWidth={2.2} />
                </View>
                <Text className={cn("text-[11px] font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="garage" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
