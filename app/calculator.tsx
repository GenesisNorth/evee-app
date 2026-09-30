import { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { PageHeader } from "@/components/page-header";
import { Droplet, Zap } from "lucide-react-native";

export default function CalculatorScreen() {
  const [kmPerMonth, setKmPerMonth] = useState("1000");
  const [petrolPrice, setPetrolPrice] = useState("1200");
  
  const km = Number(kmPerMonth) || 0;
  const price = Number(petrolPrice) || 0;
  
  // Assumptions
  const petrolEfficiency = 10; // km per liter
  const evEfficiency = 6; // km per kWh
  const kwhPrice = 200; // NGN per kWh

  const monthlyPetrolCost = (km / petrolEfficiency) * price;
  const monthlyEVCost = (km / evEfficiency) * kwhPrice;
  const monthlySavings = monthlyPetrolCost - monthlyEVCost;
  const annualSavings = monthlySavings * 12;

  return (
    <View className="flex-1 bg-background">
      <PageHeader title="EV Savings" subtitle="Calculate your ROI" showBack />
      <ScrollView className="px-5 pt-6" contentContainerStyle={{ paddingBottom: 60 }}>
        
        <View className="rounded-2xl border border-primary/30 bg-primary/10 p-6 items-center mb-6">
          <Text className="text-xs uppercase tracking-widest text-lime mb-2">Estimated Annual Savings</Text>
          <Text className="font-display-black text-4xl text-foreground">₦{(annualSavings).toLocaleString(undefined, {maximumFractionDigits: 0})}</Text>
          <Text className="text-xs text-muted-foreground mt-2">That's ₦{(monthlySavings).toLocaleString(undefined, {maximumFractionDigits: 0})} back in your pocket every month.</Text>
        </View>

        <View className="gap-5">
          <View>
            <Text className="text-xs font-semibold text-muted-foreground mb-2">Monthly Driving Distance (km)</Text>
            <View className="h-14 rounded-xl border border-white/[0.06] bg-card flex-row items-center px-4">
              <TextInput 
                className="flex-1 text-foreground font-semibold text-base"
                keyboardType="numeric"
                value={kmPerMonth}
                onChangeText={setKmPerMonth}
              />
              <Text className="text-muted-foreground text-sm font-semibold">km</Text>
            </View>
          </View>

          <View>
            <Text className="text-xs font-semibold text-muted-foreground mb-2">Average Petrol Price (₦/L)</Text>
            <View className="h-14 rounded-xl border border-white/[0.06] bg-card flex-row items-center px-4">
              <TextInput 
                className="flex-1 text-foreground font-semibold text-base"
                keyboardType="numeric"
                value={petrolPrice}
                onChangeText={setPetrolPrice}
              />
              <Text className="text-muted-foreground text-sm font-semibold">₦</Text>
            </View>
          </View>

          <View className="mt-4 flex-row gap-4">
            <View className="flex-1 rounded-2xl border border-white/[0.06] bg-card p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Droplet size={14} color="#ef4444" />
                <Text className="text-xs text-muted-foreground uppercase tracking-wider">Petrol Cost</Text>
              </View>
              <Text className="font-display-black text-xl text-red-400">₦{(monthlyPetrolCost).toLocaleString(undefined, {maximumFractionDigits: 0})}</Text>
              <Text className="text-[10px] text-muted-foreground">per month</Text>
            </View>
            
            <View className="flex-1 rounded-2xl border border-white/[0.06] bg-card p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Zap size={14} color="#b3f835" />
                <Text className="text-xs text-muted-foreground uppercase tracking-wider">EV Cost</Text>
              </View>
              <Text className="font-display-black text-xl text-lime">₦{(monthlyEVCost).toLocaleString(undefined, {maximumFractionDigits: 0})}</Text>
              <Text className="text-[10px] text-muted-foreground">per month</Text>
            </View>
          </View>
          
          <View className="rounded-xl bg-white/[0.03] p-4 border border-white/5 mt-4">
            <Text className="text-xs text-muted-foreground text-center leading-5">
              Assumes 10 km/L for a standard petrol car and 6 km/kWh for an average EV, with electricity at ₦200/kWh. Maintenance savings not included (approx 40% lower for EVs).
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
