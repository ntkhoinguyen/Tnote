import React, { useEffect, memo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { sizes } from "@/src/themes/sizes";
import { AppLogoType } from "@/src/utils/types";

export const AppLogo: React.FC<AppLogoType> = memo((props) => {
  const { isEffect } = props;
  const opacity = useSharedValue(isEffect ? 0.3 : 1);

  useEffect(() => {
    // Thực hiện hiệu ứng nhấp nháy với withRepeat
    if (isEffect) {
      opacity.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.ease }), // Tăng sáng
        -1, // Lặp lại vô hạn
        true // Lặp lại từ 1 sang 0 (từ sáng đến tối)
      );
    }
  }, [opacity, isEffect]);

  const aniStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.Image
      testID="imgAppLogo"
      resizeMode="contain"
      source={require("@/assets/images/logo.png")}
      style={[styles.logo, aniStyle]}
    />
  );
});

AppLogo.displayName = "AppLogo";

const styles = StyleSheet.create({
  logo: {
    width: sizes.appLogoWidth,
    height: sizes.appLogoHeight,
  },
});
