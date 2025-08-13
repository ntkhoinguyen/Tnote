import React, { useMemo } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { Many2MnayTagsType, TagType } from "@/src/utils/types";
import { useModal } from "@/src/useHook/useModal";
import { FontAwesomeIcon, IoniconsIcon } from "@/src/components/icon";
import { ContentList } from "@/src/components/contentList";
import { TagItem as TagItemSelected } from "@/src/components/tagItem";
import { Many2MnayTagsItem } from "@/src/components/many2manyTagItem";

export const Many2ManyTags: React.FC<Many2MnayTagsType> = (props) => {
  const {
    options,
    valueIds,
    label,
    iconLabel,
    labelStyle,
    haveAddNew,
    haveUnSelect,
    containerStyle,
    onSelect,
    onUnSelect,
    onAddNew,
    RenderItemCustom = Many2MnayTagsItem,
  } = props;

  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const objectTags = useMemo(() => {
    let objectTags: Record<string, TagType> = {};
    for (let i = 0; i < options.length; i++) {
      objectTags = { ...objectTags, [options[i].id]: options[i] };
    }
    return objectTags;
  }, [options]);

  const { open, RenderModal } = useModal({
    title: label ?? "",
    animationType: "slide",
    containerStyle: { justifyContent: "flex-end" },
    contentStyle: { height: 500 },
    content: (props: any) => (
      <ContentList
        {...props}
        selected={valueIds}
        options={options}
        haveSearch={true}
        haveAddNew={haveAddNew}
        haveUnSelect={haveUnSelect}
        onSelect={onSelect}
        onUnSelect={onUnSelect}
        onAddNew={onAddNew}
        RenderItemCustom={RenderItemCustom}
      />
    ),
  });

  const onPress = () => {
    open();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, labelStyle]}>
          {iconLabel ? (
            <FontAwesomeIcon
              name={iconLabel as any}
              size={14}
              style={styles.iconLabel}
            />
          ) : null}
          {label}
        </Text>
      ) : null}
      <Pressable testID="m2mTagsInput" style={styles.content} onPress={onPress}>
        <View style={[styles.tagsContent]}>
          {valueIds.map((item, index) => {
            const onDelete = (id: number) => {
              props.onUnSelect?.(id);
            };
            const tagInfo = objectTags[item];
            if (!tagInfo) return null;
            return (
              <Pressable key={item} testID={`tagItemSelected${index}`}>
                <TagItemSelected
                  id={tagInfo.id}
                  title={tagInfo.title}
                  color={tagInfo.color}
                  groupId={tagInfo.groupId}
                  content={tagInfo.content}
                  onDelete={onDelete}
                />
              </Pressable>
            );
          })}
        </View>
        <View style={[styles.emptyContainer]}>
          <IoniconsIcon name={"chevron-down"} size={20} color="#666" />
        </View>
      </Pressable>
      {RenderModal()}
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    label: {
      fontSize: size.fontSize.lg,
      color: colors.label,
      marginBottom: size.margin.sm,
      fontWeight: size.fontWeight.medium as "500",
    },
    iconLabel: {
      marginRight: size.margin.xs,
    },
    content: {
      borderBottomWidth: size.borderWidth.xs,
      borderColor: colors.border,
      flexDirection: "row",
    },

    tagsContent: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: size.margin.xs,
      flex: 1,
      paddingVertical: size.padding.xs,
    },
    emptyContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      marginBottom: size.margin.xs,
    },
    popoverWrapperContainer: {
      borderColor: "#c0c0c0",
      borderWidth: 1,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });
