import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

export function SaveButton({
  vehicleId,
  className,
  style,
}: {
  vehicleId: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const { data: saved } = useQuery({
    enabled: !!user,
    queryKey: ["saved", user?.id, vehicleId],
    queryFn: async () => {
      const { data } = await supabase
        .from("saved_vehicles")
        .select("vehicle_id")
        .eq("user_id", user!.id)
        .eq("vehicle_id", vehicleId)
        .maybeSingle();
      return !!data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      if (saved) {
        await supabase
          .from("saved_vehicles")
          .delete()
          .eq("user_id", user.id)
          .eq("vehicle_id", vehicleId);
      } else {
        await supabase.from("saved_vehicles").insert({ user_id: user.id, vehicle_id: vehicleId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      queryClient.invalidateQueries({ queryKey: ["saved-list"] });
      Toast.show({ type: "success", text1: saved ? "Removed from saved" : "Saved to your garage" });
    },
    onError: (e) => Toast.show({ type: "error", text1: e instanceof Error ? e.message : "Failed" }),
  });

  return (
    <Pressable
      accessibilityLabel={saved ? "Unsave" : "Save"}
      onPress={(e) => {
        e.stopPropagation();
        mutation.mutate();
      }}
      className={cn(
        "h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50",
        saved && "border-primary/50 bg-primary/15",
        className,
      )}
      style={(state) => [style, state.pressed && { opacity: 0.6, transform: [{ scale: 0.92 }] }]}
    >
      <Heart size={16} color={saved ? "#b3f835" : "#ffffff"} fill={saved ? "#b3f835" : "transparent"} strokeWidth={2} />
    </Pressable>
  );
}
