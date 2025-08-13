import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { GroupItemType } from "@/src/utils/types";

import { FontAwesome5Icon, FontAwesome6Icon } from "./icon";

export const RenderItemGroupCustom = (props: GroupItemType) => {
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { item, selected, haveUnSelect, onSelect, onUnSelect, onClose } = props;
  const isChecked = selected.includes(item.id);
  const onSelectData = () => {
    onSelect?.(item.id);
    onClose?.();
  };
  return (
    <TouchableOpacity
      testID="RenderItemGroupCustom"
      onPress={onSelectData}
      disabled={isChecked}
      style={styles.itemContainer}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={[styles.itemColor, { backgroundColor: item.color }]} />
        <Text numberOfLines={1} style={{ opacity: isChecked ? 0.5 : 1, color: colors.text }}>
          {item.title}
        </Text>
      </View>

      <View style={styles.itemContent}>
        <FontAwesome5Icon
          name="check"
          size={18}
          color={isChecked ? colors.primary : colors.iconPopupColor}
          style={{ opacity: isChecked ? 0.5 : 1 }}
        />

        {haveUnSelect ? (
          <TouchableOpacity onPress={onUnSelect}>
            <FontAwesome6Icon
              name="xmark"
              size={22}
              color={isChecked ? colors.red : colors.iconPopupColor}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: size.padding.xl,
      paddingVertical: size.padding.lg,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: size.fontSize.sm,
      fontWeight: size.fontWeight.bold as "bold",
    },
    content: {
      fontSize: size.fontSize.sm,
    },
    inputStyle: {
      fontSize: size.fontSize.xxl,
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.primary,
    },
    itemContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: size.padding.sm,
    },
    itemContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: size.margin.lg,
      marginRight: size.margin.sm,
    },
    itemColor: {
      padding: size.padding.md,
      backgroundColor: colors.primary,
      borderRadius: size.borderRadius.md,
      marginRight: size.margin.sm,
      borderColor: colors.border,
      borderWidth: size.borderWidth.xs,
    },
  });
