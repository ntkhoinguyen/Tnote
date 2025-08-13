import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { HeaderMain } from "./header";
import { useAppContext } from "@/src/useHook/useAppContext";

export default function MainScreens() {
  const {colors, t} = useAppContext();
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        header(props) {
          return <HeaderMain {...props} />;
        },
        tabBarStyle: {
          backgroundColor: colors.black,
        },
        tabBarInactiveBackgroundColor: colors.tabbarColor,
        tabBarActiveBackgroundColor: colors.tabbarColor,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
          
        }}
      />
      <Tabs.Screen
        name="chatAI"
        options={{
          title: t("chatAI"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "chatbubbles-sharp" : "chatbubbles-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tags"
        options={{
          title: t("tags"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "pricetag-sharp" : "pricetag-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: t("setting"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings-sharp" : "settings-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
