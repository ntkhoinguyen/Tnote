import React, { useMemo } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import { useAppContext } from "../useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { FontAwesome5Icon } from "./icon";

import { PriorityType } from "../utils/types";
import { colorByPriority } from "../utils/utils";

export const PriorityText = (props: PriorityType) => {
  const { colors, sizes, mode } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { item, selected, onSelect, onClose } = props;
  let textColor = colorByPriority[item.id as keyof typeof colorByPriority];

  if (mode === "light" && textColor === colors.white) textColor = colors.text;
  const isChecked = selected.includes(item.id);

  const onSelectData = () => {
    onSelect?.(item.id);
    onClose?.();
  };

  return (
    <TouchableOpacity
      testID="priorityText"
      onPress={onSelectData}
      disabled={isChecked}
      style={[styles.container, { opacity: isChecked ? 0.5 : 1 }]}
    >
      <Text style={[styles.text, { color: textColor }]}>{item.title}</Text>
      <FontAwesome5Icon
        name="check"
        size={18}
        color={isChecked ? colors.primary : colors.iconPopupColor}
        style={{ marginRight: sizes.margin.xs }}
      />
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: size.padding.sm,
    },
    text: {
      fontWeight: size.fontWeight.medium as "500",
    },
  });
};
