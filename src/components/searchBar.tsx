import React, { useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { InputField } from "@/src/components/inputField";
import { SearchBarType } from "@/src/utils/types";
import { FontAwesomeIcon, IoniconsIcon } from "@/src/components/icon";

export const SearchBar: React.FC<SearchBarType> = (props) => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const [value, setValue] = useState(props.value || "");

  const onSearch = () => {
    props.onSearch?.(value);
  };

  const onRemove = () => {
    setValue("");
    props.onSearch?.("");
  };

  const RightSection = () => {
    return value ? (
      <TouchableOpacity testID="searchBarRemove" onPress={onRemove}>
        <FontAwesomeIcon name="remove" size={20} color={colors.red} />
      </TouchableOpacity>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <InputField
          testID="searchBarInput"
          label={""}
          placeholder={t("search")}
          value={value}
          onChangeText={setValue}
          RightSection={RightSection}
          inputStyle={{ backgroundColor: colors.searchBar }}
        />
      </View>
      <TouchableOpacity
        testID="searchBarSearch"
        style={styles.icon}
        onPress={onSearch}
      >
        <IoniconsIcon name="search" size={22} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      borderRadius: size.borderRadius.xs,
      padding: size.padding.xs,
      backgroundColor: colors.primary,
      marginLeft: size.margin.sm,
    },
  });
