import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, StyleSheet, Animated, LayoutChangeEvent } from "react-native";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import {
  calendarModesType,
  calendarType,
  layoutComponentType,
  stateReducerType,
  TaskDetailType,
} from "@/src/utils/types";

import { CalendarHeader } from "@/src/components/main/calendar/header";
import { CalendarNameDays } from "@/src/components/main/calendar/nameDays";
import { CalendarModes } from "@/src/components/main/calendar/calendarModes";

import {
  getLayoutCalendar,
  getTaskByMonth,
  getTasksCustom,
  mapTasksToDates,
} from "@/src/business/main/calendar";
import { reLoadScreenByTaskUpdateAction } from "@/src/redux/updateTask/action";
import { ButtonCreate } from "@/src/components/createButton";
import { screenReloadTask } from "@/src/utils/utils";

export const Calendar = (props: calendarType) => {
  const { isCurrentTab, searchText = "", groups, tags } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const isReloadScreen = useSelector(
    (state: stateReducerType) => state.updateTask.screenUpdate.calendar
  );

  const [isNeedReload, setIsNeedReload] = useState(false);

  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [daysInMonth, setDaysInMonth] = useState<string[][]>([]);
  const [events, setEvents] = useState<Record<string, TaskDetailType[]>>({});
  const [error, setError] = useState("");

  const layoutComponent = useRef<layoutComponentType>({
    container: { height: 0, width: 0 },
    header: { height: 0, width: 0 },
    nameDays: { height: 0, width: 0 },
  });
  const calendarModes = useRef<calendarModesType>({
    monthFullScreen: {
      height: 0,
      width: 0,
      dateHeight: 0,
    },
    monthHalfScreen: {
      height: 0,
      width: 0,
      dateHeight: 0,
    },
    week: {
      height: 0,
      width: 0,
      dateHeight: 0,
    },
  });
  const maxEventCount = useRef(0);
  const disableChangeMode = useRef(false);
  const isChangeMonth = useRef(false);

  const [mode, setMode] = useState("week");

  const onLayoutContainer = ({
    nativeEvent: { layout },
  }: LayoutChangeEvent) => {
    layoutComponent.current.container = {
      width: layout.width,
      height: layout.height,
    };
    checkLayoutDone();
  };

  const onLayoutHeader = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    layoutComponent.current.header = {
      width: layout.width,
      height: layout.height,
    };
    checkLayoutDone();
  };

  const onLayouNameDays = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    layoutComponent.current.nameDays = {
      width: layout.width,
      height: layout.height,
    };
    checkLayoutDone();
  };

  const checkLayoutDone = async () => {
    if (
      layoutComponent.current.container.height > 0 &&
      layoutComponent.current.header.height > 0 &&
      layoutComponent.current.nameDays.height > 0
    ) {
      const result = getLayoutCalendar(selectedDate, layoutComponent.current);
      if (result === null) {
        setError(t("notFoundData"));
      } else {
        maxEventCount.current = result.maxEventCount;
        disableChangeMode.current = result.disableChangeMode;
        calendarModes.current = result.calendarModes;
        const taskByMonth = await getTaskByMonth(selectedDate);
        const taskCustom = await getTasksCustom(taskByMonth, groups, tags);
        const events = mapTasksToDates(taskCustom, result.daysInMonth);
        setDaysInMonth(result.daysInMonth);
        setEvents(events);
        setMode(result.mode);
      }
    }
  };

  useEffect(() => {
    if (isChangeMonth.current === true) {
      isChangeMonth.current = false;
      checkLayoutDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    setIsNeedReload(true);
  }, [groups, tags, searchText]);

  useEffect(() => {
    if (isReloadScreen) {
      setIsNeedReload(true);
    }
  }, [isReloadScreen]);

  useEffect(() => {
    if (isCurrentTab && isNeedReload) {
      checkLayoutDone();
      dispatch(reLoadScreenByTaskUpdateAction("calendar"));
      setIsNeedReload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentTab, isNeedReload]);

  const onToday = (date: string) => {
    isChangeMonth.current = false;
    if (moment().format("MM") !== moment(selectedDate).format("MM")) {
      isChangeMonth.current = true;
    }
    setSelectedDate(moment().format("YYYY-MM-DD"));
  };

  const onCalendarPrev = () => {
    let newDate = moment(selectedDate, "YYYY-MM-DD");
    isChangeMonth.current = false;
    if (mode === "week") {
      newDate = newDate.subtract(7, "days");
      if (moment(newDate).format("MM") !== moment(selectedDate).format("MM")) {
        isChangeMonth.current = true;
      }
    } else if (mode === "monthHalfScreen" || mode === "monthFullScreen") {
      newDate = newDate.subtract(1, "month");
      isChangeMonth.current = true;
    }
    setSelectedDate(newDate.format("YYYY-MM-DD"));
  };

  const onCalendarNext = () => {
    let newDate = moment(selectedDate, "YYYY-MM-DD");
    isChangeMonth.current = false;
    if (mode === "week") {
      newDate = newDate.add(7, "days");
      if (moment(newDate).format("MM") !== moment(selectedDate).format("MM")) {
        isChangeMonth.current = true;
      }
    } else if (mode === "monthHalfScreen" || mode === "monthFullScreen") {
      newDate = newDate.add(1, "month");
      isChangeMonth.current = true;
    }

    setSelectedDate(newDate.format("YYYY-MM-DD"));
  };

  const onChangeMode = (mode: string) => {
    setMode(mode);
  };

  return (
    <Animated.View style={styles.container} onLayout={onLayoutContainer}>
      {/* month, year and button today */}
      <CalendarHeader
        selectedDate={selectedDate}
        mode={mode}
        onLayout={onLayoutHeader}
        onToday={onToday}
        onCalendarPrev={onCalendarPrev}
        onCalendarNext={onCalendarNext}
      />

      {/* name days: Mon, Tues, Wed, Thu, Fri, Sat, Sun */}
      <CalendarNameDays
        onLayout={onLayouNameDays}
        calendarModes={calendarModes.current}
      />

      {/* error */}
      {error !== "" ? <Text style={styles.error}>{error}</Text> : null}

      {/* calendar */}
      {calendarModes.current.week.height > 0 ? (
        <CalendarModes
          selectedDate={selectedDate}
          calendarModes={calendarModes.current}
          mode={mode}
          disableChangeMode={disableChangeMode.current}
          daysInMonth={daysInMonth}
          events={events}
          groups={groups}
          maxEventCount={maxEventCount.current}
          onChangeMode={onChangeMode}
          onChanegeDate={setSelectedDate}
        />
      ) : null}
      <ButtonCreateMemo />
    </Animated.View>
  );
};

const ButtonCreateMemo = memo(
  () => {
    const router = useRouter();
    const onPressCreate = () => {
      router.push(
        `/screens/details/task?id=0?from=${screenReloadTask.calendar}`
      );
    };
    return <ButtonCreate onPress={onPressCreate} />;
  },
  () => true
);

ButtonCreateMemo.displayName = "ButtonCreateMemo";

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    error: {
      fontSize: size.fontSize.xxl,
      color: colors.light_gray,
      textAlign: "center",
      marginTop: size.margin.xl,
    },
  });
};
