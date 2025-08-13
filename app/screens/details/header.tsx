import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { useAppContext } from "@/src/useHook/useAppContext";
import { sizes } from "@/src/themes/sizes";
import { lightColors } from "@/src/themes/colors";
import { IoniconsIcon, FontAwesome5Icon } from "@/src/components/icon";

export type HeaderDetailType = {
  options: {
    title?: string;
    showButtonSave?: boolean;
    onSave?: () => void;
    onRemove?: () => void;
  };
} & any;
export const HeaderDetail: React.FC<any> = (props: HeaderDetailType) => {
  const { options } = props;
  const { title, showButtonSave, onSave, onRemove } = options;

  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = () => {
    onSave?.();
  };

  const handleRemove = () => {
    onRemove?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack}>
        <IoniconsIcon name="arrow-back" size={24} color={colors.white} />
      </TouchableOpacity>
      <View style={styles.textContent}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {showButtonSave ? (
        <TouchableOpacity testID="headerSave" onPress={handleSave}>
          <FontAwesome5Icon name="check" size={20} color={colors.white} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity testID="headerRemove" onPress={handleRemove}>
          <FontAwesome5Icon
            name="trash"
            size={20}
            color={colors.white}
            style={{ marginLeft: 2 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (colors: typeof lightColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      height: size.heightHeader,
      backgroundColor: colors.headerColor,
      paddingHorizontal: size.padding.xl,
      alignItems: "center",
      flexDirection: "row",
      paddingTop: size.padding.xxl,
    },
    textContent: {
      flex: 1,
      alignItems: "center",
    },
    title: {
      fontSize: size.fontSize.xxl,
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.white,
    },
  });

export default HeaderDetail;
