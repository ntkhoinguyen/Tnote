// hooks/useRefresh.tsx
import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Animated, Easing, PanResponder, StyleSheet } from "react-native";

import { LoadingIcon } from "@/src/components/loadingIcon";
import { defaultColors } from "@/src/themes/colors";
import {LoadingIconType} from "@/src/utils/types";

const thresholdHeight = 200;

type UseRefreshProps = LoadingIconType & {
  onRefresh?: () => void;
  topPosition?: number;
  timeToStop?: number;
};

export const useRefresh = (props: UseRefreshProps) => {
  const {
    onRefresh,
    topPosition = 20,
    size = "small",
    color = defaultColors.primary,
    timeToStop = 60000,
  } = props;

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [showIndicator, setShowIndicator] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 10,
        onPanResponderGrant(e, gestureState) {
          setShowIndicator(true);
        },
        onPanResponderMove: (_, gesture) => {
          if (!refreshing) {
            translateY.setValue(gesture.dy);
            opacity.setValue((gesture.dy / thresholdHeight) * 1.5);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          // if release gesture is greater than threshold, trigger refresh
          if (!refreshing) {
            if (gesture.dy > thresholdHeight) {
              Animated.timing(translateY, {
                toValue: topPosition,
                duration: 350,
                useNativeDriver: true,
                easing: Easing.ease,
              }).start();

              Animated.timing(opacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
                easing: Easing.ease,
              }).start();
              setRefreshing(true);
            } else {
              Animated.timing(translateY, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
              }).start();

              Animated.timing(opacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
              }).start();
              setShowIndicator(false);
              setRefreshing(false);
            }
          }
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshing, topPosition]
  );

  useEffect(() => {
    if (refreshing) {
      onRefresh?.();
      setTimeout(() => {
        setShowIndicator(false);
        setRefreshing(false);
        translateY.setValue(0);
        opacity.setValue(0);
      }, timeToStop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshing, refreshing]);

  const stop = () => {
    setShowIndicator(false);
    setRefreshing(false);
    translateY.setValue(0);
    opacity.setValue(0);
  };

  const indicator = useMemo(() => {
    return <LoadingIcon size={size} color={color} />;
  }, [color, size]);

  const RefreshIndicator = useCallback(() => {
    if (!showIndicator) return null;
    return (
      <Animated.View
        style={[
          styles.indicatorWrap,
          {
            top: topPosition,
            opacity: opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        {indicator}
      </Animated.View>
    );
  }, [indicator, opacity, showIndicator, topPosition, translateY]);

  return {
    panHandlers: panResponder.panHandlers,
    isRefreshing: showIndicator,
    RefreshIndicator,
    stop,
  };
};

const styles = StyleSheet.create({
  indicatorWrap: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 9999,
  },
});

export default useRefresh;
