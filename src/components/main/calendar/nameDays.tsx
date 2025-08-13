import React, { useMemo } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { calendarNameDays } from "@/src/utils/types";
import { calendarHeaderHeight, DAYS } from "@/src/utils/utils";

export const CalendarNameDays = (props: calendarNameDays) => {
  const { calendarModes } = props;
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  return (
    <Animated.View style={styles.container} onLayout={props.onLayout}>
      {DAYS.map((item, index) => {
        return (
          <View
            key={"renderTitleDays" + index}
            style={[
              styles.dayContainer,
              {
                width: calendarModes.week.width / 7,
              },
            ]}
          >
            <Text
              style={[
                styles.dayText,
                { color: index === 6 ? "red" : colors.text },
              ]}
            >
              {t(item)}
            </Text>
          </View>
        );
      })}
    </Animated.View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      height: calendarHeaderHeight,
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: size.borderWidth.xs,
      borderColor: colors.border,
    },
    dayContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    dayText: {
      fontSize: size.fontSize.md,
      fontWeight: size.fontWeight.bold as "bold",
    },
  });
};
