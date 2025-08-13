// components/buttonField.tsx
import React, { useMemo } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useAppContext } from "@/src/useHook/useAppContext";
import { lightColors } from "../themes/colors";
import { sizes } from "@/src/themes/sizes";
import { ButtonFieldType } from "../utils/types";

export const ButtonField: React.FC<ButtonFieldType> = (props) => {
  const { colors, sizes } = useAppContext();
  const {
    text,
    containerStyle = {},
    type,
    color = colors.primary,
    disabled,
    LeftSection,
    RightSection,
    onPress,
  } = props;

  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const backgroundColor = useMemo(() => {
    return type === "fill" ? color : colors.white;
  }, [type, color, colors.white]);

  const textColor = useMemo(() => {
    return type === "fill" ? colors.white : color;
  }, [type, color, colors.white]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor: color },
        containerStyle,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      {LeftSection ? <LeftSection /> : null}

      <View
        testID="btnTextContent"
        style={{ flex: 1, marginVertical: sizes.margin.xs }}
      >
        {text ? (
          <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        ) : null}
      </View>

      {RightSection ? <RightSection /> : null}
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof lightColors, size: typeof sizes) =>
  StyleSheet.create({
    button: {
      width: "100%",
      padding: size.padding.xs,
      borderRadius: size.borderRadius.sm,
      marginVertical: size.margin.sm,
      flexDirection: "row",
      borderWidth: size.borderWidth.xs,
    },
    text: {
      color: colors.white,
      textAlign: "center",
      fontWeight: size.fontWeight.bold as "bold",
      fontSize: size.fontSize.lg,
    },
  });
