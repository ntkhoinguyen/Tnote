import React, { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "../themes/colors";
import { sizes } from "@/src/themes/sizes";
import { normalize } from "../utils/utils";

import { SearchBar } from "@/src/components/searchBar";
import { FontAwesome5Icon, FontAwesome6Icon } from "@/src/components/icon";

import {
  ContentListType,
  ModalInputSelectionItemType,
  RenderItemDefaultProps,
} from "@/src/utils/types";

export const ContentList = (props: ContentListType) => {
  const { haveSearch, options, haveAddNew, haveUnSelect, RenderItemCustom } =
    props;
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const [searchText, setSearchText] = useState("");

  const optionFilter = useMemo(
    () =>
      options.filter((item) =>
        normalize(item.title.toLowerCase().trim()).includes(
          normalize(searchText.toLowerCase().trim())
        )
      ),
    [options, searchText]
  );

  const onAddNew = () => {
    props.onAddNew?.();
    props.onClose?.();
  };

  const renderItem = ({ item }: { item: ModalInputSelectionItemType }) => {
    if (RenderItemCustom)
      return (
        <RenderItemCustom
          key={item.id}
          item={item as any}
          selected={props.selected}
          haveUnSelect={haveUnSelect}
          onSelect={props.onSelect}
          onUnSelect={props.onUnSelect}
          onClose={props.onClose}
        />
      );
    return (
      <RenderItemDefault
        key={item.id}
        item={item}
        selected={props.selected}
        haveUnSelect={haveUnSelect}
        onSelect={props.onSelect}
        onUnSelect={props.onUnSelect}
        onClose={props.onClose}
      />
    );
  };

  const itemSeparatorComponent = useCallback(() => {
    return <View style={styles.separator} />;
  }, [styles.separator]);

  return (
    <View testID="contentList" style={styles.container}>
      {haveSearch ? (
        <View style={{ height: 40, width: "100%" }}>
          <SearchBar onSearch={setSearchText} />
        </View>
      ) : null}
      <View style={styles.content}>
        <FlashList
          data={optionFilter}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={itemSeparatorComponent}
          showsVerticalScrollIndicator={true}
        />
      </View>
      {haveAddNew ? (
        <TouchableOpacity style={styles.btnAddItem} onPress={onAddNew}>
          <Text style={styles.textAddItem}>+ Thêm mới</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export const RenderItemDefault = (props: RenderItemDefaultProps) => {
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
      testID="renderItemDefault"
      onPress={onSelectData}
      disabled={isChecked}
      style={styles.itemContainer}
    >
      <Text numberOfLines={1} style={{ opacity: isChecked ? 0.5 : 1 }}>
        {item.title}
      </Text>
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

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingVertical: size.padding.sm,
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
    separator: {
      height: sizes.borderWidth.xs,
      width: "100%",
      backgroundColor: colors.separator,
      opacity: 0.5,
    },
    btnAddItem: {
      backgroundColor: colors.primary,
      padding: size.padding.sm,
      borderRadius: size.borderRadius.sm,
      justifyContent: "center",
      alignItems: "center",
      margin: size.margin.sm,
    },
    textAddItem: {
      color: colors.white,
      fontWeight: size.fontWeight.bold as "bold",
      fontSize: size.fontSize.lg,
    },
  });
};
