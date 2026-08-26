import { type ReactNode } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: "default" | "outline";
  className?: string;
  style?: StyleProp<ViewStyle>;
}

// className should only carry sizing/layout (h-12, w-full, rounded-xl, mt-4…) —
// variant="default" supplies the lime gradient fill + glow, variant="outline"
// supplies the bordered transparent look. This mirrors the web Button, which
// baked the same "bg-lime-gradient shadow-lime" combo into nearly every call site.
export function Button({
  children,
  onPress,
  disabled,
  variant = "default",
  className,
  style,
}: ButtonProps) {
  const content = (
    <View className="flex-row items-center justify-center gap-2 px-4">
      {typeof children === "string" ? (
        <Text
          className={cn(
            "text-sm font-semibold",
            variant === "default" ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );

  if (variant === "outline") {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={cn(
          "items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]",
          disabled && "opacity-50",
          className,
        )}
        style={({ pressed }) => [style, pressed && !disabled && { opacity: 0.7 }]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(disabled && "opacity-50", className)}
      style={({ pressed }) => [
        { shadowColor: "#b3f835", shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
        style,
        pressed && !disabled && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
    >
      <LinearGradient
        colors={["#92ef00", "#b3f835"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="items-center justify-center rounded-xl"
        style={{ flex: 1 }}
      >
        {content}
      </LinearGradient>
    </Pressable>
  );
}
