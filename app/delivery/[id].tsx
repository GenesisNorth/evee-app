import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, CheckCircle, Home, LoaderCircle, MapPin } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const times = ["09:00", "11:00", "14:00", "16:00"];

export default function DeliveryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [method, setMethod] = useState<"home" | "hub">("hub");
  const [selectedDay, setSelectedDay] = useState(days[1]);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [submitting, setSubmitting] = useState(false);

  async function schedule() {
    setSubmitting(true);
    try {
      // Mocking the backend API call to schedule delivery
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Toast.show({ type: "success", text1: "Delivery scheduled!" });
      router.back();
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to schedule" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <PageHeader title="Schedule Delivery" subtitle="Choose your handoff details" showBack />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-5 pt-4"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="mb-6">
          <Text className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Delivery Method</Text>
          <View className="gap-3">
            <Pressable
              onPress={() => setMethod("hub")}
              className={cn("flex-row items-center gap-4 rounded-2xl border p-4", method === "hub" ? "border-primary/60 bg-primary/10" : "border-white/[0.06] bg-card")}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white/[0.05]">
                <MapPin size={20} color={method === "hub" ? "#b3f835" : "#fafafa"} />
              </View>
              <View className="flex-1">
                <Text className={cn("font-display-black text-base", method === "hub" ? "text-lime" : "text-foreground")}>Pickup at Evee Hub</Text>
                <Text className="text-[11px] text-muted-foreground">Victoria Island, Lagos</Text>
              </View>
              {method === "hub" && <CheckCircle size={20} color="#b3f835" />}
            </Pressable>

            <Pressable
              onPress={() => setMethod("home")}
              className={cn("flex-row items-center gap-4 rounded-2xl border p-4", method === "home" ? "border-primary/60 bg-primary/10" : "border-white/[0.06] bg-card")}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white/[0.05]">
                <Home size={20} color={method === "home" ? "#b3f835" : "#fafafa"} />
              </View>
              <View className="flex-1">
                <Text className={cn("font-display-black text-base", method === "home" ? "text-lime" : "text-foreground")}>Home Delivery</Text>
                <Text className="text-[11px] text-muted-foreground">We'll bring it right to your door</Text>
              </View>
              {method === "home" && <CheckCircle size={20} color="#b3f835" />}
            </Pressable>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {days.map((day, idx) => (
                <Pressable
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  className={cn("items-center justify-center rounded-2xl border w-16 h-20", selectedDay === day ? "border-primary/60 bg-primary/15" : "border-white/[0.06] bg-card")}
                >
                  <Text className="text-[10px] uppercase text-muted-foreground">{day}</Text>
                  <Text className={cn("font-display-black text-lg mt-1", selectedDay === day ? "text-lime" : "text-foreground")}>{15 + idx}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="mb-8">
          <Text className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Select Time</Text>
          <View className="flex-row flex-wrap gap-2">
            {times.map((time) => (
              <Pressable
                key={time}
                onPress={() => setSelectedTime(time)}
                className={cn("flex-row items-center gap-2 rounded-xl border px-4 py-3 min-w-[47%]", selectedTime === time ? "border-primary/60 bg-primary/15" : "border-white/[0.06] bg-card")}
              >
                <Calendar size={14} color={selectedTime === time ? "#b3f835" : "#9b9fa3"} />
                <Text className={cn("text-sm font-semibold", selectedTime === time ? "text-lime" : "text-foreground")}>{time}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Button disabled={submitting} onPress={schedule} className="h-14 w-full rounded-2xl">
            {submitting && <LoaderCircle size={18} color="#060606" className="mr-2" />}
            <Text className="text-base font-semibold text-primary-foreground">Confirm Appointment</Text>
          </Button>
          <Text className="mt-4 text-center text-[10px] text-muted-foreground">
            You will receive a confirmation email with instructions for the handoff day.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
