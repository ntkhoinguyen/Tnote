import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "../themes/colors";
import { sizes, NUM_BARS, indicatorSize } from "@/src/themes/sizes";
import { LoadingIconType } from "../utils/types";

export const LoadingIcon: React.FC<LoadingIconType> = (props) => {
  const { size = "large", color = defaultColors.primary } = props;
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);
  const indiSize = indicatorSize[size];

  const rotate = useSharedValue(0);

  // ✅ Đặt animation vào useEffect để tránh lỗi
  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View
      testID="loadingContainer"
      style={[styles.container, props.containerStyle]}
    >
      <Animated.View
        testID="loadingSpinner"
        style={[styles.spinner, spinnerStyle]}
      >
        {Array.from({ length: NUM_BARS }).map((_, i) => {
          const angle = (360 / NUM_BARS) * i;
          const opacity = (i + 1) / NUM_BARS;

          return (
            <View
              key={i}
              testID={`loadingBar${i}`}
              style={[
                styles.bar,
                {
                  transform: [
                    { rotate: `${angle}deg` },
                    { translateY: indiSize.translateY },
                  ],
                  opacity,
                },
                {
                  width: indiSize.width,
                  height: indiSize.height,
                  backgroundColor: color,
                },
              ]}
            />
          );
        })}
      </Animated.View>
      <Image
        testID="loadingLogo"
        source={require("@/assets/images/logo.png")}
        style={[
          styles.logo,
          { height: indiSize.width * 7, width: indiSize.width * 7 },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    spinner: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
    },
    bar: {
      position: "absolute",
    },
    logo: {
      zIndex: 1,
    },
  });
};
