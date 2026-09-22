import { useState } from "react";
import { View, Text, Pressable, Image, ScrollView, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Moon, 
  Shield, 
  HelpCircle,
  ChevronRight,
  LogOut
} from "lucide-react-native";
import { useSession } from "@/hooks/use-session";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/lib/supabase";

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View className="mt-6">
      <Text className="mb-2 px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </Text>
      <View className="overflow-hidden rounded-2xl bg-card border border-white/[0.06]">
        {children}
      </View>
    </View>
  );
}

function SettingsRow({ 
  icon: Icon, 
  title, 
  value, 
  showToggle, 
  toggleValue, 
  onToggle,
  isLast 
}: { 
  icon: any, 
  title: string, 
  value?: string,
  showToggle?: boolean,
  toggleValue?: boolean,
  onToggle?: (v: boolean) => void,
  isLast?: boolean 
}) {
  return (
    <Pressable className={`flex-row items-center px-4 py-3.5 ${!isLast ? 'border-b border-white/5' : ''}`}>
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-white/5 mr-3">
        <Icon size={16} color="#fafafa" />
      </View>
      <Text className="flex-1 font-medium text-foreground">{title}</Text>
      
      {value && <Text className="text-sm text-muted-foreground mr-2">{value}</Text>}
      
      {showToggle ? (
        <Switch 
          value={toggleValue} 
          onValueChange={onToggle}
          trackColor={{ false: "#333", true: "#b3f835" }}
          thumbColor="#fff"
        />
      ) : (
        <ChevronRight size={16} color="#4d4d4d" />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useSession();
  const { data: profile } = useProfile();

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        contentContainerStyle={{ paddingTop: Math.max(insets.top, 18), paddingBottom: 140 }} 
        className="px-5"
      >
        {/* Profile Header */}
        <View className="items-center mt-4 mb-2">
          <View className="relative">
            <Image
              source={profile?.avatar_url ? { uri: profile.avatar_url } : require("../../assets/images/avatar-fallback.jpg")}
              style={{ height: 96, width: 96, borderRadius: 48, borderWidth: 3, borderColor: "rgba(179,248,53,0.7)" }}
            />
            <Pressable className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-lime border-4 border-background">
              <Settings size={14} color="#060606" />
            </Pressable>
          </View>
          <Text className="mt-4 font-display-black text-2xl text-foreground">
            {profile?.full_name || "Genesis"}
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">
            {user?.email || "genesis@example.com"}
          </Text>
          <View className="mt-4 flex-row gap-2">
            <View className="rounded-full bg-white/5 px-3 py-1 border border-white/10">
              <Text className="text-xs font-semibold text-lime">Premium Member</Text>
            </View>
            <View className="rounded-full bg-white/5 px-3 py-1 border border-white/10">
              <Text className="text-xs font-medium text-foreground">Joined 2026</Text>
            </View>
          </View>
        </View>

        {/* Settings Hub Groups */}
        <SettingsGroup title="Account">
          <SettingsRow icon={User} title="Personal Information" />
          <SettingsRow icon={CreditCard} title="Payment Methods" value="Visa •••• 4242" />
          <SettingsRow icon={Shield} title="Security & Privacy" isLast />
        </SettingsGroup>

        <SettingsGroup title="Preferences">
          <SettingsRow 
            icon={Moon} 
            title="Dark Mode" 
            showToggle 
            toggleValue={darkMode} 
            onToggle={setDarkMode} 
          />
          <SettingsRow 
            icon={Bell} 
            title="Push Notifications" 
            showToggle 
            toggleValue={notifications} 
            onToggle={setNotifications}
            isLast 
          />
        </SettingsGroup>

        <SettingsGroup title="Support">
          <SettingsRow icon={HelpCircle} title="Help Center & FAQ" />
          <SettingsRow icon={FileText} title="Terms of Service" isLast />
        </SettingsGroup>

        <Pressable 
          onPress={() => supabase.auth.signOut()}
          className="mt-8 flex-row items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-4 border border-red-500/20"
        >
          <LogOut size={18} color="#ee343b" />
          <Text className="font-semibold text-red-500">Sign Out</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

// Minimal mock icon for Terms of Service since it wasn't imported at top
function FileText({ size, color }: { size: number, color: string }) {
  return (
    <View style={{ width: size, height: size, borderWidth: 1.5, borderColor: color, borderRadius: 2 }} />
  );
}
