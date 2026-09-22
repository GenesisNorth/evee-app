import { useState } from "react";
import { Pressable, Text, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Users, CalendarDays, MessageSquare, ChevronRight, MapPin } from "lucide-react-native";
import { PageHeader } from "@/components/page-header";
import Animated, { FadeInDown } from "react-native-reanimated";
import { cn } from "@/lib/utils";

const EVENTS = [
  { id: "1", title: "Lagos EV Test Drive Showcase", date: "Sat, Oct 28", location: "Eko Atlantic City", attendees: 142 },
  { id: "2", title: "EV Owners Meetup & Coffee", date: "Sun, Nov 05", location: "Ikoyi, Lagos", attendees: 38 },
];

const FORUMS = [
  { id: "1", topic: "Charging Infrastructure Updates", category: "NEWS", replies: 124, lastActive: "12m ago" },
  { id: "2", topic: "Model Y vs. BYD Atto 3 Comparison", category: "BUYING", replies: 89, lastActive: "1h ago" },
  { id: "3", topic: "Solar Charging Setups at Home", category: "TECH", replies: 215, lastActive: "3h ago" },
];

export default function ConnectScreen() {
  const [activeTab, setActiveTab] = useState<"events" | "forums">("events");

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="Connect" subtitle="Join the EV movement" showBack />
      
      {/* Tabs */}
      <View className="px-5 mt-4">
        <View className="flex-row items-center rounded-2xl bg-white/[0.04] p-1 border border-white/5">
          <Pressable 
            onPress={() => setActiveTab("events")}
            className={cn(
              "flex-1 items-center justify-center rounded-xl py-2.5",
              activeTab === "events" ? "bg-white/10" : "bg-transparent"
            )}
          >
            <Text className={cn("text-xs font-semibold", activeTab === "events" ? "text-foreground" : "text-muted-foreground")}>
              Meetups & Events
            </Text>
          </Pressable>
          <Pressable 
            onPress={() => setActiveTab("forums")}
            className={cn(
              "flex-1 items-center justify-center rounded-xl py-2.5",
              activeTab === "forums" ? "bg-white/10" : "bg-transparent"
            )}
          >
            <Text className={cn("text-xs font-semibold", activeTab === "forums" ? "text-foreground" : "text-muted-foreground")}>
              Discussions
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }} className="px-5">
        
        {activeTab === "events" && (
          <Animated.View entering={FadeInDown.springify()} className="gap-5">
            <View className="rounded-3xl border border-primary/30 bg-primary/10 p-6 items-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-3">
                <CalendarDays size={32} color="#b3f835" />
              </View>
              <Text className="font-display-black text-xl text-foreground">Host an Event</Text>
              <Text className="mt-1 text-xs text-muted-foreground text-center px-4">
                Organize a test drive or meetup in your local community to help accelerate EV adoption.
              </Text>
              <Pressable className="mt-5 rounded-xl bg-lime px-6 py-3">
                <Text className="font-semibold text-primary-foreground text-sm">Submit Proposal</Text>
              </Pressable>
            </View>

            <View className="mt-4 gap-3">
              <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Upcoming Near You
              </Text>
              {EVENTS.map((event) => (
                <Pressable key={event.id} className="rounded-2xl border border-white/10 bg-card p-4">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-4">
                      <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime mb-1">
                        {event.date}
                      </Text>
                      <Text className="font-display-black text-lg text-foreground leading-snug">
                        {event.title}
                      </Text>
                      <View className="flex-row items-center gap-1.5 mt-2">
                        <MapPin size={12} color="#9b9fa3" />
                        <Text className="text-xs text-muted-foreground">{event.location}</Text>
                      </View>
                    </View>
                    <View className="items-center justify-center rounded-xl bg-white/5 px-3 py-2">
                      <Users size={16} color="#fafafa" />
                      <Text className="text-[10px] text-foreground mt-1 font-semibold">{event.attendees}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {activeTab === "forums" && (
          <Animated.View entering={FadeInDown.springify()} className="gap-3">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Trending Topics
              </Text>
              <Pressable>
                <Text className="text-xs font-semibold text-lime">New Post</Text>
              </Pressable>
            </View>

            {FORUMS.map((forum) => (
              <Pressable key={forum.id} className="flex-row items-center gap-4 rounded-2xl border border-white/5 bg-card p-4">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1.5">
                    <View className="rounded-md bg-white/10 px-1.5 py-0.5">
                      <Text className="text-[9px] font-semibold tracking-widest text-muted-foreground">{forum.category}</Text>
                    </View>
                    <Text className="text-[10px] text-muted-foreground">• {forum.lastActive}</Text>
                  </View>
                  <Text className="font-display-black text-sm text-foreground leading-snug">
                    {forum.topic}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
                  <MessageSquare size={12} color="#b3f835" />
                  <Text className="text-[10px] font-semibold text-lime">{forum.replies}</Text>
                </View>
              </Pressable>
            ))}
          </Animated.View>
        )}

      </ScrollView>
    </View>
  );
}
