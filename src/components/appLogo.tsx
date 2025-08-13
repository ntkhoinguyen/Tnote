// components/AppLogo.tsx
import React from "react";
import { Image, StyleSheet } from "react-native";
import { sizes } from "@/src/themes/sizes";

export const AppLogo = () => (
  <Image
    source={require("@/assets/images/logo.png")}
    style={styles.logo}
    resizeMode="contain"
  />
);

const styles = StyleSheet.create({
  logo: {
    width: sizes.appLogoWidth,
    height: sizes.appLogoHeight,
    marginBottom: sizes.margin.xl,
  },
});

export default AppLogo;
