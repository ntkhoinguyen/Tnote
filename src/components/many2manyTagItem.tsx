import React, { useMemo } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { FontAwesome5Icon, FontAwesome6Icon } from "@/src/components/icon";

import { Many2MnayTagsItemType } from "@/src/utils/types";

export const Many2MnayTagsItem = (props: Many2MnayTagsItemType) => {
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { item, selected, haveUnSelect, onUnSelect, onSelect } = props;
  const textColor = item.color === colors.white ? colors.gray : item.color;

  const isChecked = selected.includes(item.id);

  const onSelectData = () => {
    onSelect?.(item.id);
  };

  const onUnSelectData = () => {
    onUnSelect?.(item.id);
  };

  return (
    <TouchableOpacity
      testID="Many2MnayTagsItem"
      onPress={onSelectData}
      disabled={isChecked}
      style={[styles.container, { opacity: isChecked ? 0.5 : 1 }]}
    >
      <Text style={[styles.text, { color: textColor }]}>{item.title}</Text>
      <View style={styles.content}>
        <FontAwesome5Icon
          name="check"
          size={18}
          color={isChecked ? colors.primary : colors.iconPopupColor}
          style={{ marginRight: sizes.margin.xs }}
        />
        {haveUnSelect ? (
          <TouchableOpacity onPress={onUnSelectData} disabled={!isChecked}>
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

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: size.padding.sm,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: size.margin.lg,
      marginRight: size.margin.sm,
    },
    text: {
      fontWeight: size.fontWeight.medium as "500",
    },
  });
};
