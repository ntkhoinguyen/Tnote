import React, { useMemo } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import { calendarHeaderType } from "@/src/utils/types";
import { calendarHeaderHeight } from "@/src/utils/utils";
import { useSingleTouch } from "@/src/useHook/useSigleTouch";
import { AntDesignIcon } from "@/src/components/icon";

import { getFormatHeader } from "@/src/business/main/calendar";

export const CalendarHeader = (props: calendarHeaderType) => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const { mode = "week", onToday, onCalendarPrev, onCalendarNext } = props;

  const date = getFormatHeader(props.selectedDate, mode);

  const isToday = moment(props.selectedDate, "YYYY-MM-DD").isSame(
    moment().format("YYYY-MM-DD"),
    "day"
  );

  const onTodayPress = useSingleTouch(() => {
    onToday?.(moment().format("YYYY-MM-DD"));
  });

  const onPrev = useSingleTouch(() => {
    onCalendarPrev?.();
  });

  const onNext = useSingleTouch(() => {
    onCalendarNext?.();
  });

  return (
    <Animated.View style={styles.container} onLayout={props.onLayout}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity disabled={false} onPress={onPrev}>
          <AntDesignIcon name="caretleft" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{date}</Text>
        <TouchableOpacity disabled={false} onPress={onNext}>
          <AntDesignIcon name="caretright" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity disabled={false} onPress={onTodayPress}>
        <Text
          style={[
            styles.btnToday,
            {
              opacity: isToday ? 0.7 : 1,
              backgroundColor: isToday ? colors.light_gray : colors.primary,
            },
          ]}
        >
          {t("today")}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      height: calendarHeaderHeight,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: size.padding.md,
      backgroundColor: colors.background,
    },
    title: {
      color: colors.label,
      fontSize: size.fontSize.xl,
      fontWeight: size.fontWeight.bold as "bold",
    },
    btnToday: {
      padding: size.padding.sm,
      borderRadius: size.borderRadius.xs,
      backgroundColor: colors.primary,
      color: colors.white,
      fontSize: size.fontSize.md,
      fontWeight: size.fontWeight.bold as "bold",
    },
  });
};
