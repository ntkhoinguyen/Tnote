import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { sizes } from "@/src/themes/sizes";
import { lightColors } from "@/src/themes/colors";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";

export const HeaderMain: React.FC<BottomTabHeaderProps> = (
  props: BottomTabHeaderProps
) => {
  const { options } = props;
  const { title } = options;

  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const createStyles = (colors: typeof lightColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      height: size.heightHeader,
      backgroundColor: colors.headerColor,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: size.padding.xxl,
      borderBottomColor: colors.border,
      borderBottomWidth: sizes.borderWidth.xs,
    },
    title: {
      fontSize: size.fontSize.xxl,
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.white,
    },
  });
