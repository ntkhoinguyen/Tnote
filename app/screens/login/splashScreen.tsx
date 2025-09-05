import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { AppLogo } from "@/src/components/appLogo";

import { initDatabase } from "@/src/database/setting";

const SplashCustom: React.FC = () => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const router = useRouter();

  const [isReady, setIsReady] = useState<string>("waiting");

  useEffect(() => {
    const tryHideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
        const result = await initDatabase();
        setIsReady(result ? "ready" : "error");
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

  return (
    <View style={styles.container}>
      <AppLogo isEffect={true} />
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
      backgroundColor: colors.background,
    },
    textError: {
      color: colors.error,
      fontSize: size.fontSize.lg,
      marginTop: size.margin.xl,
    },
  });
};

export default SplashCustom;
