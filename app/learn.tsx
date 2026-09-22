import { Pressable, Text, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ChevronRight, Clock, BookOpen } from "lucide-react-native";
import { PageHeader } from "@/components/page-header";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const ARTICLES = [
  {
    id: "1",
    title: "The Ultimate Guide to EV Battery Health",
    category: "BATTERY",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Charging in Nigeria: What You Need to Know",
    category: "INFRASTRUCTURE",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1660662243734-716b1e6ce48e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Understanding EV Range Anxiety",
    category: "LIFESTYLE",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Home vs. Public Charging: Cost Breakdown",
    category: "FINANCE",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1620804470550-93a0058b4bce?q=80&w=800&auto=format&fit=crop",
  }
];

export default function LearnScreen() {
  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Journal" subtitle="Master the EV lifestyle" showBack />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }} className="px-5">
        
        {/* Featured Article */}
        <Animated.View entering={FadeInDown.springify()} className="mb-8">
          <Pressable className="overflow-hidden rounded-3xl border border-white/10 bg-card">
            <View className="relative h-64 w-full">
              <Image 
                source={{ uri: ARTICLES[0].image }} 
                className="h-full w-full" 
                style={{ resizeMode: "cover" }} 
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)", "#000"]}
                className="absolute inset-0"
              />
              <View className="absolute bottom-5 left-5 right-5">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime mb-2">
                  {ARTICLES[0].category}
                </Text>
                <Text className="font-display-black text-2xl text-foreground">
                  {ARTICLES[0].title}
                </Text>
                <View className="mt-3 flex-row items-center gap-2">
                  <Clock size={12} color="#9b9fa3" />
                  <Text className="text-xs text-muted-foreground">{ARTICLES[0].readTime}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Latest Stories
        </Text>

        <View className="gap-4">
          {ARTICLES.slice(1).map((article, i) => (
            <Animated.View key={article.id} entering={FadeInDown.delay((i + 1) * 100).springify()}>
              <Pressable className="flex-row items-center gap-4 rounded-2xl border border-white/5 bg-card p-3">
                <Image 
                  source={{ uri: article.image }} 
                  className="h-24 w-24 rounded-xl"
                  style={{ resizeMode: "cover" }}
                />
                <View className="flex-1 justify-center py-1">
                  <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime mb-1">
                    {article.category}
                  </Text>
                  <Text className="font-display-black text-sm text-foreground mb-2" numberOfLines={2}>
                    {article.title}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <BookOpen size={12} color="#9b9fa3" />
                    <Text className="text-[10px] text-muted-foreground">{article.readTime}</Text>
                  </View>
                </View>
                <ChevronRight size={16} color="#4d4d4d" />
              </Pressable>
            </Animated.View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}
