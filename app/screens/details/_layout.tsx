import { Stack } from "expo-router";

import { HeaderDetail } from "@/app/screens/details/header";
import { useAppContext } from "@/src/useHook/useAppContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailsLayout() {
  const { t } = useAppContext();
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor: "#000000" }}
    >
      <Stack
        screenOptions={{
          header(props) {
            return <HeaderDetail {...props} />;
          },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="tag" options={{ title: t("tagDetail") }} />
        <Stack.Screen name="group" options={{ title: t("groupDetail") }} />
        <Stack.Screen name="task" options={{ title: t("taskDetail") }} />
      </Stack>
    </SafeAreaView>
  );
}
