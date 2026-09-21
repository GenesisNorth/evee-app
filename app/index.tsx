import { Redirect } from "expo-router";

export default function Index() {
  // Bypassing auth to directly access the app for UI testing
  return <Redirect href="/(tabs)/explore" />;
}
