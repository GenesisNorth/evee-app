import { View, Text, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PageHeader } from "@/components/page-header";
import { Clock } from "lucide-react-native";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock content based on ID or just a generic article
  const article = {
    title: id === "1" ? "EV Charging at Home: The Complete Setup" : "Charging in Nigeria: What You Need to Know",
    category: "GUIDE",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop",
  };

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="EVEE Journal" showBack />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }}>
        <Image 
          source={{ uri: article.image }} 
          className="w-full h-64"
          style={{ resizeMode: 'cover' }}
        />
        <View className="px-5 pt-6">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-lime mb-2">{article.category}</Text>
          <Text className="font-display-black text-2xl text-foreground mb-4">{article.title}</Text>
          <View className="flex-row items-center gap-2 mb-8 pb-6 border-b border-white/10">
            <Clock size={14} color="#9b9fa3" />
            <Text className="text-xs text-muted-foreground">{article.readTime}</Text>
            <Text className="text-xs text-muted-foreground mx-2">•</Text>
            <Text className="text-xs text-muted-foreground">Oct 24, 2026</Text>
          </View>
          
          <Text className="text-sm text-foreground leading-relaxed mb-6 font-semibold">
            Electric vehicles (EVs) are the future of transportation. They offer zero tailpipe emissions, instant torque, and significantly lower operating costs.
          </Text>
          
          <Text className="text-lg font-display-black text-foreground mb-3 mt-4">Charging Infrastructure</Text>
          <Text className="text-sm text-muted-foreground leading-relaxed mb-6">
            Whether you charge at home using a standard outlet (Level 1), install a dedicated wall connector (Level 2), or use public fast chargers, the ecosystem is rapidly growing to support your needs across the country. Planning a road trip has never been easier with integrated route planners that automatically factor in charging stops.
          </Text>

          <View className="p-4 rounded-xl border-l-4 border-lime bg-white/[0.03] mb-6">
            <Text className="text-sm text-foreground italic leading-relaxed">
              "The transition to electric mobility isn't just about saving the environment—it's about upgrading the entire driving experience."
            </Text>
          </View>

          <Text className="text-lg font-display-black text-foreground mb-3">Maintenance & Battery</Text>
          <Text className="text-sm text-muted-foreground leading-relaxed mb-6">
            Say goodbye to oil changes and spark plugs. The main components to monitor are your tires and washer fluid. To maximize battery longevity, it's generally recommended to keep your daily charge limit between 20% and 80%, reserving 100% charges for long road trips.
          </Text>

        </View>
      </ScrollView>
    </View>
  );
}
