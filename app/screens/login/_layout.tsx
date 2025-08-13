import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScreensLayout() {
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor: "#000000" }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          navigationBarHidden: false,
          animation: "slide_from_right",
          statusBarStyle: "light",
        }}
      ></Stack>
    </SafeAreaView>
  );
}
