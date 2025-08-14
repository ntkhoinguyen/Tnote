import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "@/src/useHook/useTheme";
import { TranslateProvider } from "@/src/useHook/useTranslate";
import { NotificationProvider } from "@/src/useHook/useNotification";
import { UserProvider } from "@/src/useHook/userContext";
import store from "@/src/redux/store";
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NotificationProvider>
          <ThemeProvider>
            <TranslateProvider>
              <UserProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                  }}
                />
              </UserProvider>
            </TranslateProvider>
          </ThemeProvider>
        </NotificationProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
