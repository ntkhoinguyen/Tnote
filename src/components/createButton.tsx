import React, { useMemo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppContext } from "../useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
type ButtonCreateType = {
  onPress: () => void;
  containerStyle?: object;
};

export const ButtonCreate: React.FC<ButtonCreateType> = (props) => {
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  return (
    <TouchableOpacity
      testID="buttonCreate"
      onPress={props.onPress}
      style={[styles.container, props.containerStyle]}
    >
      <Ionicons name="add" size={32} color={colors.white} />
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      padding: size.padding.sm,
      borderRadius: "50%",
      position: "absolute",
      right: 30,
      bottom: 30,
    },
  });
};

export default ButtonCreate;
