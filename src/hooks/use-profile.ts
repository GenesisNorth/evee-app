import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/use-session";
import type { Profile } from "@/lib/types";

export function useProfile() {
  const { user } = useSession();
  return useQuery({
    enabled: !!user,
    queryKey: ["profile", user?.id],
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
