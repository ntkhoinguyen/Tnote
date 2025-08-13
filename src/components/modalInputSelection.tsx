import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { ModalInputSelectionType } from "@/src/utils/types";

import { InputField } from "@/src/components/inputField";
import { useModal } from "@/src/useHook/useModal";
import { IoniconsIcon, FontAwesome6Icon } from "./icon";
import { ContentList } from "@/src/components/contentList";

export const ModalInputSelection: React.FC<ModalInputSelectionType> = (
  props
) => {
  const {
    options,
    valueId,
    label,
    labelStyle,
    placeholder,
    borderType,
    haveAddNew,
    haveUnSelect,
    containerStyle = {},
    onSelect,
    onGotoDetail,
    onUnSelect,
    onAddNew,
    RenderItemCustom,
  } = props;

  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const value = useMemo(
    () => options.find((item) => item.id === valueId),
    [options, valueId]
  );

  const { open, RenderModal } = useModal({
    title: label ?? "",
    animationType: "slide",
    containerStyle: { justifyContent: "flex-end" },
    contentStyle: { height: 500 },
    content: (props: any) => (
      <ContentList
        {...props}
        options={options}
        selected={[valueId || ""]}
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

  const RightSection = useCallback(() => {
    if (!value || !value.title || !onGotoDetail) {
      return (
        <IoniconsIcon name={"chevron-down"} size={20} color={colors.gray} />
      );
    } else {
      return (
        <TouchableOpacity onPress={onGotoDetail}>
          <FontAwesome6Icon
            name="arrow-right-from-bracket"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      );
    }
  }, [colors.gray, colors.primary, onGotoDetail, value]);

  return (
    <TouchableOpacity
      testID="ModalInputSelection"
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <InputField
        label={label}
        labelStyle={labelStyle}
        placeholder={placeholder}
        value={value?.title ?? ""}
        editable={false}
        borderType={borderType}
        RightSection={RightSection}
      />
      {RenderModal()}
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {},
  });
};
