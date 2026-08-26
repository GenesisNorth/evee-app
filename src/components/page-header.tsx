import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
}

export function PageHeader({ title, subtitle, showBack, right }: PageHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center gap-3 px-5 pb-4"
      style={{ paddingTop: Math.max(insets.top, 18) }}
    >
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Back"
          className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <ChevronLeft size={20} color="#fafafa" strokeWidth={2.2} />
        </Pressable>
      ) : (
        <View className="w-10" />
      )}
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-display-black text-xl text-foreground">
          {title}
        </Text>
        {subtitle && (
          <Text numberOfLines={1} className="mt-0.5 text-[11px] text-muted-foreground">
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}
