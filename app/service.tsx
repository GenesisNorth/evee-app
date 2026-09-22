import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Calendar, CheckCircle2, Circle, ChevronLeft, MapPin, Truck, Home } from "lucide-react-native";
import { PageHeader } from "@/components/page-header";
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SERVICE_TYPES = [
  { id: "battery", title: "Battery Health Check", desc: "Comprehensive diagnostic of cell balance and degradation." },
  { id: "software", title: "Software Update", desc: "Firmware flashing and ECU calibration." },
  { id: "tires", title: "Tire Rotation & Alignment", desc: "Extend tire life and improve efficiency." },
  { id: "general", title: "General Maintenance", desc: "Fluid checks, cabin filter replacement, and inspection." },
];

const DATES = ["Oct 28", "Oct 29", "Oct 30", "Nov 01", "Nov 02"];
const TIMES = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"];

export default function ServiceScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Form State
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"center" | "mobile" | null>(null);

  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
    else router.back();
  };

  const nextStep = () => setStep(s => s + 1);

  return (
    <View className="flex-1 bg-background">
      {step === 0 ? (
        <PageHeader title="Service" subtitle="Book maintenance" showBack />
      ) : (
        <View className="flex-row items-center px-5 pt-14 pb-2">
          {step < 3 && (
            <Pressable onPress={prevStep} className="mr-4 h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <ChevronLeft size={20} color="#fafafa" />
            </Pressable>
          )}
          <View className="flex-1">
            <Text className="text-[10px] font-semibold uppercase tracking-widest text-lime">
              {step === 1 ? "Step 2 of 3" : step === 2 ? "Step 3 of 3" : "Confirmed"}
            </Text>
            <Text className="font-display-black text-xl text-foreground">
              {step === 1 ? "Schedule" : step === 2 ? "Location" : "All Set!"}
            </Text>
          </View>
        </View>
      )}

      {/* Progress Bar */}
      {step > 0 && step < 3 && (
        <View className="h-1 w-full bg-white/5">
          <Animated.View 
            className="h-full bg-lime" 
            style={{ width: `${(step / 3) * 100}%` }} 
          />
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: step === 0 ? 0 : 20 }} className="px-5">
        
        {step === 0 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
            {/* Vehicle Selector (Mock) */}
            <View className="mt-4">
              <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Select Vehicle
              </Text>
              <Pressable className="flex-row items-center justify-between rounded-2xl border border-white/10 bg-card p-4">
                <View>
                  <Text className="text-[10px] uppercase tracking-widest text-lime">Tesla</Text>
                  <Text className="font-display-black text-lg text-foreground">Model Y Long Range</Text>
                  <Text className="text-xs text-muted-foreground mt-1">VIN: 5YJYGDEE8L912****</Text>
                </View>
                <View className="h-10 w-10 items-center justify-center rounded-full bg-white/[0.04]">
                  <Text className="text-xs text-foreground font-semibold">Edit</Text>
                </View>
              </Pressable>
            </View>

            {/* Service Types */}
            <View className="mt-8">
              <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Service Required
              </Text>
              <View className="gap-3">
                {SERVICE_TYPES.map((service) => (
                  <Pressable
                    key={service.id}
                    onPress={() => setSelectedService(service.id)}
                    className={cn(
                      "flex-row items-center rounded-2xl border p-4",
                      selectedService === service.id 
                        ? "border-primary bg-primary/10" 
                        : "border-white/10 bg-card"
                    )}
                  >
                    <View className="mr-4">
                      {selectedService === service.id ? (
                        <CheckCircle2 size={24} color="#b3f835" />
                      ) : (
                        <Circle size={24} color="#4d4d4d" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="font-display-black text-sm text-foreground">{service.title}</Text>
                      <Text className="text-xs text-muted-foreground mt-1 leading-snug">{service.desc}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="gap-8">
            <View>
              <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Select Date
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {DATES.map((date) => (
                  <Pressable
                    key={date}
                    onPress={() => setSelectedDate(date)}
                    className={cn(
                      "rounded-xl border px-5 py-3", 
                      selectedDate === date ? "border-primary/60 bg-primary/15" : "border-white/10 bg-card"
                    )}
                  >
                    <Text className={cn("text-sm font-semibold", selectedDate === date ? "text-lime" : "text-muted-foreground")}>{date}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Select Time
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {TIMES.map((time) => (
                  <Pressable
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    className={cn(
                      "rounded-xl border px-5 py-3", 
                      selectedTime === time ? "border-primary/60 bg-primary/15" : "border-white/10 bg-card"
                    )}
                  >
                    <Text className={cn("text-sm font-semibold", selectedTime === time ? "text-lime" : "text-muted-foreground")}>{time}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Button onPress={nextStep} className="h-14 rounded-2xl" disabled={!selectedDate || !selectedTime}>
              <Text className="font-semibold text-primary-foreground">Continue to Location</Text>
            </Button>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="gap-5">
            
            <Pressable 
              onPress={() => setDeliveryMethod("center")}
              className={cn(
                "rounded-2xl border p-5",
                deliveryMethod === "center" ? "border-primary bg-primary/10" : "border-white/10 bg-card"
              )}
            >
              <View className="flex-row items-center gap-4 mb-3">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-white/5">
                  <MapPin size={24} color={deliveryMethod === "center" ? "#b3f835" : "#fafafa"} />
                </View>
                <View className="flex-1">
                  <Text className="font-display-black text-lg text-foreground">Service Center</Text>
                  <Text className="text-xs text-muted-foreground">Drop off at the nearest hub.</Text>
                </View>
                {deliveryMethod === "center" && <CheckCircle2 size={24} color="#b3f835" />}
              </View>
              {deliveryMethod === "center" && (
                <View className="mt-2 rounded-xl bg-background p-3">
                  <Text className="font-semibold text-sm text-foreground">Victoria Island Service Hub</Text>
                  <Text className="text-xs text-muted-foreground mt-0.5">14 Adetokunbo Ademola St</Text>
                </View>
              )}
            </Pressable>

            <Pressable 
              onPress={() => setDeliveryMethod("mobile")}
              className={cn(
                "rounded-2xl border p-5",
                deliveryMethod === "mobile" ? "border-primary bg-primary/10" : "border-white/10 bg-card"
              )}
            >
              <View className="flex-row items-center gap-4 mb-3">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-white/5">
                  <Truck size={24} color={deliveryMethod === "mobile" ? "#b3f835" : "#fafafa"} />
                </View>
                <View className="flex-1">
                  <Text className="font-display-black text-lg text-foreground">Mobile Ranger</Text>
                  <Text className="text-xs text-muted-foreground">We come to your home or office.</Text>
                </View>
                {deliveryMethod === "mobile" && <CheckCircle2 size={24} color="#b3f835" />}
              </View>
              {deliveryMethod === "mobile" && (
                <View className="mt-2 rounded-xl bg-background p-3 flex-row items-center gap-3">
                  <Home size={16} color="#4d4d4d" />
                  <View>
                    <Text className="font-semibold text-sm text-foreground">Home Address</Text>
                    <Text className="text-xs text-muted-foreground mt-0.5">Lekki Phase 1, Lagos</Text>
                  </View>
                </View>
              )}
            </Pressable>

            <Button onPress={nextStep} className="mt-4 h-14 rounded-2xl" disabled={!deliveryMethod}>
              <Text className="font-semibold text-primary-foreground">Confirm Booking</Text>
            </Button>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeInDown} className="items-center pt-8">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/20 mb-6">
              <CheckCircle2 size={48} color="#b3f835" />
            </View>
            <Text className="font-display-black text-3xl text-foreground mb-2 text-center">Service Booked!</Text>
            <Text className="text-center text-sm text-muted-foreground px-4 mb-8">
              Your appointment is confirmed. You can manage your booking from the dashboard.
            </Text>
            
            <View className="w-full rounded-3xl border border-white/10 bg-card p-6 mb-8 gap-4">
              <View className="flex-row justify-between border-b border-white/10 pb-4">
                <Text className="text-xs text-muted-foreground">Date & Time</Text>
                <Text className="text-sm font-semibold text-foreground">{selectedDate} @ {selectedTime}</Text>
              </View>
              <View className="flex-row justify-between border-b border-white/10 pb-4">
                <Text className="text-xs text-muted-foreground">Service</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {SERVICE_TYPES.find(s => s.id === selectedService)?.title}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted-foreground">Location</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {deliveryMethod === "center" ? "VI Hub" : "Mobile Ranger (Home)"}
                </Text>
              </View>
            </View>

            <Pressable 
              onPress={() => router.push("/explore")}
              className="h-14 w-full rounded-2xl bg-white/10 flex-row items-center justify-center gap-2"
            >
              <Text className="font-semibold text-foreground text-base">Done</Text>
            </Pressable>
          </Animated.View>
        )}

      </ScrollView>

      {/* Floating Action Bar (Only for Step 0) */}
      {step === 0 && selectedService && (
        <Animated.View 
          entering={FadeInDown.springify()}
          className="absolute bottom-8 left-5 right-5 overflow-hidden rounded-2xl bg-[#141414] border border-white/10 p-4 shadow-xl flex-row items-center justify-between"
        >
          <View>
            <Text className="text-xs text-muted-foreground">Next Step</Text>
            <Text className="font-display-black text-lg text-foreground">Pick a Date</Text>
          </View>
          <Pressable onPress={nextStep} className="bg-lime rounded-xl px-5 py-3 flex-row items-center gap-2">
            <Calendar size={16} color="#060606" />
            <Text className="font-semibold text-[#060606] text-sm">Continue</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
