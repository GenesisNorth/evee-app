import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

async function createSessionFromUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) return null;

  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
  return data.session;
}

export async function signInWithGoogle() {
  const redirectTo = AuthSession.makeRedirectUri();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data.url) throw new Error("No auth URL returned");

  const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (res.type === "success" && res.url) {
    return createSessionFromUrl(res.url);
  }
  if (res.type === "cancel" || res.type === "dismiss") {
    throw new Error("Sign in was cancelled");
  }
  return null;
}
