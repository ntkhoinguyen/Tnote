import React, { useCallback, useMemo, useRef } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors, colorsPicker } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { usePopover } from "@/src/useHook/usePopover";
import { PopoverWrapper } from "@/src/components/popoverWrapper";
import { ColorPickerType } from "../utils/types";

export const ColorPicker: React.FC<ColorPickerType> = (props) => {
  const { colors, sizes } = useAppContext();

  const styles = useMemo(
    () => createStyles(colors, sizes, { backgroundColor: props.value }),
    [colors, sizes, props.value]
  );
  const colorRef = useRef(null);
  const { visible, target, content, open, close } = usePopover();

  const onSelectColor = (color: string) => {
    props.onSelect(color);
    close();
  };
  const onOpenPicker = () => {
    open({
      targetRef: colorRef,
      content: <ListColorPicker onSelect={onSelectColor} />,
    });
  };

  const onClosedPopover = () => {
    close();
  };

  return (
    <View>
      <TouchableOpacity testID="colorPickerBtn" onPress={onOpenPicker}>
        <View ref={colorRef} style={styles.container} />
      </TouchableOpacity>
      <PopoverWrapper
        visible={visible}
        target={target}
        onClose={onClosedPopover}
        arrowSize={{ width: 12, height: 12 }}
        popoverStyle={styles.popoverStyle}
      >
        {content}
      </PopoverWrapper>
    </View>
  );
};

type OptionsComponetType = {
  onSelect: (color: string) => void;
};

export const ListColorPicker = (props: OptionsComponetType) => {
  const { colors, sizes } = useAppContext();
  const styles = useMemo(
    () => createStyles(colors, sizes, {}),
    [colors, sizes]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      const onSelectColor = () => props.onSelect(item);
      return (
        <TouchableOpacity
          key={index}
          testID={`itemColor${index}`}
          onPress={onSelectColor}
        >
          <View style={[styles.item, { backgroundColor: item }]} />
        </TouchableOpacity>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <View testID="colorPickerList" style={styles.colorContainer}>
      <FlashList
        data={colorsPicker}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={4}
      />
    </View>
  );
};

type paramsStyleType = {
  backgroundColor?: string;
};

const createStyles = (
  colors: typeof defaultColors,
  size: typeof sizes,
  params: paramsStyleType
) => {
  const { backgroundColor } = params;
  return StyleSheet.create({
    container: {
      backgroundColor: backgroundColor || colors.backgroundPopup,
      borderRadius: size.borderRadius.xs,
      height: 24,
      width: 24,
      borderWidth: size.borderWidth.xs,
      borderColor: colors.border,
    },
    popoverStyle: {
      backgroundColor: colors.backgroundPopup,
    },
    colorContainer: {
      width: 150,
      padding: size.padding.sm,
      backgroundColor: colors.backgroundPopup,
    },
    item: {
      borderRadius: size.borderRadius.xs,
      height: 24,
      width: 24,
      margin: size.margin.xs,
      borderWidth: size.borderWidth.xs,
      borderColor: colors.border,
    },
  });
};
