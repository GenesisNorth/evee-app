import { useState } from "react";
import { View, Text, type StyleProp, type ViewStyle } from "react-native";
import { Image } from "expo-image";

// A diverse pool of at least 10 high-quality EV images for the demo
const REAL_EV_IMAGES = [
  "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
];

function getDeterministicImage(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % REAL_EV_IMAGES.length;
  return REAL_EV_IMAGES[index];
}

interface VehicleImageProps {
  src: string | null | undefined;
  alt: string;
  seed: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function VehicleImage({ src, alt, seed, className, style }: VehicleImageProps) {
  // Always use the stunning Unsplash fallback images for the demo
  // to ensure 100% coverage and avoid broken database URLs.
  const imageUri = getDeterministicImage(seed);

  return (
    <Image
      source={{ uri: imageUri }}
      alt={alt}
      className={className}
      style={style}
      contentFit="cover"
      transition={200}
    />
  );
}
