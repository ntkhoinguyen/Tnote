import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { ModalSelectionType } from "@/src/utils/types";

import { useModal } from "@/src/useHook/useModal";
import { ContentList } from "@/src/components/contentList";

export const ModalSelection: React.FC<ModalSelectionType> = (props) => {
  const {
    label,
    options,
    valueId,
    haveAddNew,
    haveUnSelect,
    onSelect,
    onUnSelect,
    onAddNew,
    RenderItemCustom,
    RenderTarget,
  } = props;

  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

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

  return (
    <TouchableOpacity
      testID="ModalSelection"
      onPress={onPress}
      style={styles.container}
    >
      <RenderTarget />
      {RenderModal()}
    </TouchableOpacity>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {},
  });
};
