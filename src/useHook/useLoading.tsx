import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { useAppContext } from "./useAppContext";
import { lightColors } from "../themes/colors";
import { sizes } from "@/src/themes/sizes";
import { LoadingIconType } from "../utils/types";
import { LoadingIcon } from "@/src/components/loadingIcon";

export const useLoading = (props: LoadingIconType) => {
  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const [isShow, setIsShow] = React.useState(false);

  const open = () => {
    setIsShow(true);
  };

  const close = () => {
    setIsShow(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 60000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const LoadingComponent = () => {
    if (!isShow) return null;
    return (
      <View style={[styles.LoadingPlaceholderContainer, props.containerStyle]}>
        <LoadingIcon
          size={props.size}
          color={props.color}
          containerStyle={styles.loadingIcon}
        />
      </View>
    );
  };

  return {
    open,
    close,
    LoadingComponent,
  };
};

const createStyles = (colors: typeof lightColors, size: typeof sizes) => {
  return StyleSheet.create({
    LoadingPlaceholderContainer: {
      height: "100%",
      width: "100%",
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundLoading,
      opacity: 0.65,
    },
    loadingIcon: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "transparent",
    },
  });
};
