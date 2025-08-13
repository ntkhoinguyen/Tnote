import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { IoniconsIcon } from "@/src/components/icon";
import { TagType } from "@/src/utils/types";

export const TagItem: React.FC<TagType> = (props) => {
  const { id, title, color, onDelete } = props;
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const onDeleteTag = () => {
    onDelete?.(id);
  };

  const textColor = color === colors.white ? colors.light_gray : colors.white;
  const marginRight = onDelete && sizes.margin.md + 2;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color, borderColor: textColor },
      ]}
    >
      <Text style={[styles.text, { color: textColor, marginRight }]}>
        {title}
      </Text>
      <Pressable testID="deleteTag" onPress={onDeleteTag} style={styles.icon}>
        <IoniconsIcon name="close" size={16} color={textColor} />
      </Pressable>
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      paddingHorizontal: size.padding.sm + 1,
      paddingVertical: size.padding.xs + 1,
      borderRadius: size.borderRadius.md,
      borderWidth: size.borderWidth.xs,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "flex-start",
    },
    text: {
      fontSize: size.fontSize.sm,
      color: colors.white,
      marginRight: size.margin.xs,
      fontWeight: size.fontWeight.bold as "bold",
    },
    icon: {
      position: "absolute",
      top: size.margin.xs - 1,
      right: size.margin.xs,
      opacity: 0.8,
    },
  });
