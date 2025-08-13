import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";

import { defaultColors } from "../themes/colors";
import { sizes } from "@/src/themes/sizes";
import { useAppContext } from "../useHook/useAppContext";
import { PopoverWrapperType } from "@/src/utils/types";

export const PopoverWrapper: React.FC<PopoverWrapperType> = (props) => {
  const {
    visible,
    target,
    placement = PopoverPlacement.BOTTOM,
    arrowSize = { width: 12, height: 12 },
    popoverStyle = {},
    containerStyle = {},
    children,
    onClose,
  } = props;

  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  return (
    <Popover
      isVisible={visible}
      from={target}
      onRequestClose={onClose}
      placement={placement}
      backgroundStyle={{ backgroundColor: "transparent" }}
      arrowSize={arrowSize}
      popoverStyle={popoverStyle}
    >
      <View style={[styles.container, containerStyle]}>{children}</View>
    </Popover>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
  });
};
