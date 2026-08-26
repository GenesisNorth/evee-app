import { useState } from "react";
import { View, Text, type StyleProp, type ViewStyle } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { gradientColorsFromSeed } from "@/lib/format";

interface VehicleImageProps {
  src: string | null | undefined;
  alt: string;
  seed: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function VehicleImage({ src, alt, seed, className, style }: VehicleImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!src && !failed;

  if (showImage) {
    return (
      <Image
        source={{ uri: src }}
        alt={alt}
        onError={() => setFailed(true)}
        className={className}
        style={style}
        contentFit="cover"
      />
    );
  }

  return (
    <LinearGradient
      colors={gradientColorsFromSeed(seed)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={className}
      style={style}
    >
      <View className="flex-1 items-center justify-center">
        <Text className="font-display-black text-5xl text-white/15">
          {seed.slice(0, 2).toUpperCase()}
        </Text>
      </View>
    </LinearGradient>
  );
}
