// components/buttonField.tsx
import React, { useMemo, useRef, memo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "../themes/colors";
import { sizes } from "@/src/themes/sizes";
import { ButtonFieldType } from "../utils/types";
import { getButtonStyles } from "@/src/utils/utils";

export const ButtonField: React.FC<ButtonFieldType> = memo((props) => {
  const { colors, sizes } = useAppContext();
  const {
    text,
    disabled,
    type = "fill",
    color = colors.primary,
    containerStyle = {},
    LeftSection,
    RightSection,
    onPress,
  } = props;

  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);
  const timer = useRef<number | null>(null);
  const { backgroundColor, textColor, borderColor } = useMemo(
    () => getButtonStyles(type, color, colors),
    [type, color, colors]
  );

  const onPressHandler = () => {
    if (timer.current) return;
    if (!disabled && onPress) onPress();

    timer.current = setTimeout(() => {
      timer.current = null;
    }, 2000);
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, borderColor }, containerStyle]}
      disabled={disabled}
      onPress={onPressHandler}
      accessibilityRole="button"
      accessibilityLabel="ButtonField"
    >
      {LeftSection ? <LeftSection /> : null}

      {text ? (
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      ) : null}

      {RightSection ? <RightSection /> : null}
    </TouchableOpacity>
  );
});

ButtonField.displayName = "ButtonField";

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    button: {
      padding: size.padding.xs,
      borderRadius: size.borderRadius.sm,
      marginVertical: size.margin.sm,
      flexDirection: "row",
      borderWidth: size.borderWidth.xs,
      justifyContent: "space-around",
    },
    text: {
      color: colors.white,
      textAlign: "center",
      fontWeight: size.fontWeight.bold as "bold",
      fontSize: size.fontSize.lg,
      marginHorizontal: size.margin.sm,
    },
  });
