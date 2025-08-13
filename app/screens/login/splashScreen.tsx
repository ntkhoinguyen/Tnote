import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { initDatabase } from "@/src/database/setting";

const SplashCustom: React.FC = () => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const router = useRouter();

  const [isReady, setIsReady] = React.useState<string>("waiting");
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const tryHideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
        const result = await initDatabase();
        if (result) {
          setIsReady("ready");
        } else {
          setIsReady("error");
        }
      } catch (e) {
        console.log("[SplashCustom][tryHideSplash][ERROR] ----", e);
        setIsReady("error");
      }
    };
    tryHideSplash();
  }, []);

  useEffect(() => {
    if (isReady === "ready") {
      setTimeout(() => {
        router.replace("/screens/login/login");
      }, 2000);
    }
  }, [isReady, router]);

  useEffect(() => {
    // Thực hiện hiệu ứng nhấp nháy với withRepeat
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.ease }), // Tăng sáng
      -1, // Lặp lại vô hạn
      true // Lặp lại từ 1 sang 0 (từ sáng đến tối)
    );
  }, [opacity]);

  const aniStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundMode }]}
    >
      <Animated.Image
        source={require("@/assets/images/logo.png")}
        style={[styles.logo, aniStyle]}
      />
      {isReady === "error" && (
        <Text style={styles.textError}>{t("errorStartApp")}</Text>
      )}
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: size.appLogoWidth,
      height: size.appLogoHeight,
    },
    textError: {
      color: colors.error,
      fontSize: size.fontSize.lg,
      marginTop: size.margin.xl,
    },
  });
};

export default SplashCustom;
