import { View, Text, Dimensions, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle,
  interpolate,
  Extrapolation
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const SPLASHES = [
  {
    id: "1",
    title: "The Future of Mobility",
    subtitle: "Experience the thrill of zero emissions and instant torque. Your electric journey starts here.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Power Anywhere",
    subtitle: "From home charging setups to an expanding public network, power is always within reach.",
    image: "https://images.unsplash.com/photo-1620804470550-93a0058b4bce?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "One Ecosystem",
    subtitle: "Buy, finance, insure, and service your EV—all seamlessly integrated in one powerful app.",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop"
  }
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View className="flex-1 bg-background">
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
        bounces={false}
      >
        {SPLASHES.map((splash, index) => {
          const imageStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const scale = interpolate(
              scrollX.value,
              inputRange,
              [1.2, 1, 1.2],
              Extrapolation.CLAMP
            );
            return {
              transform: [{ scale }]
            };
          });

          const textStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const translateY = interpolate(
              scrollX.value,
              inputRange,
              [50, 0, 50],
              Extrapolation.CLAMP
            );
            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0, 1, 0],
              Extrapolation.CLAMP
            );
            return {
              transform: [{ translateY }],
              opacity
            };
          });

          return (
            <View key={splash.id} style={{ width, height }}>
              <Animated.Image
                source={{ uri: splash.image }}
                style={[{ width, height, position: 'absolute' }, imageStyle]}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', '#040404']}
                style={{ position: 'absolute', width, height }}
              />
              
              <View className="flex-1 justify-end px-8" style={{ paddingBottom: insets.bottom + 140 }}>
                <Animated.View style={textStyle}>
                  <Text className="font-display-black text-5xl text-white mb-4 leading-[52px]">{splash.title}</Text>
                  <Text className="text-lg text-white/80 leading-7 font-medium">{splash.subtitle}</Text>
                </Animated.View>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Pagination & Next Button Overlay */}
      <View className="absolute bottom-0 left-0 right-0 px-8 flex-row items-center justify-between" style={{ paddingBottom: Math.max(insets.bottom, 40) }}>
        <View className="flex-row gap-2">
          {SPLASHES.map((_, index) => {
            const dotStyle = useAnimatedStyle(() => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              const dotWidth = interpolate(
                scrollX.value,
                inputRange,
                [8, 24, 8],
                Extrapolation.CLAMP
              );
              const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.3, 1, 0.3],
                Extrapolation.CLAMP
              );
              return {
                width: dotWidth,
                opacity
              };
            });
            return (
              <Animated.View
                key={index}
                className="h-2 rounded-full bg-lime"
                style={dotStyle}
              />
            );
          })}
        </View>

        <Pressable 
          onPress={() => router.push('/auth')}
          className="h-16 w-16 rounded-full bg-lime items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(179,248,53,0.5)] border-4 border-[#040404]"
        >
          <ArrowRight size={24} color="#060606" />
        </Pressable>
      </View>
    </View>
  );
}
