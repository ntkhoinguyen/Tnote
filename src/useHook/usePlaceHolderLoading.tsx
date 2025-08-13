import React, { useCallback, useEffect } from "react";
import { View } from "react-native";

import { LoadingIcon } from "@/src/components/loadingIcon";
import { LoadingIconType } from "@/src/utils/types";
import { useAppContext } from "@/src/useHook/useAppContext";

export const usePlaceHolderLoading = (props: LoadingIconType) => {
  const { colors } = useAppContext();
  const { size = "small", color = colors.primary } = props;

  const [isShow, setIsShow] = React.useState(false);

  const openLoading = () => {
    setIsShow(true);
  };

  const closeLoading = () => {
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

  const placeholderLoading = useCallback(() => {
    if (isShow)
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            position: "absolute",
            backgroundColor: colors.white,
            opacity: 0.7,
            zIndex: 9999,
          }}
        >
          <LoadingIcon
            size={size}
            color={color}
            containerStyle={{
              backgroundColor: colors.white,
              opacity: 0.7,
            }}
          />
        </View>
      );
    return null;
  }, [color, size, colors.white, isShow]);

  return {
    openLoading,
    closeLoading,
    placeholderLoading: placeholderLoading,
  };
};
