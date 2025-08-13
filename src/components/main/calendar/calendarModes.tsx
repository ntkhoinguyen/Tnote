import React, { useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  FlatList,
  GestureResponderEvent,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import moment from "moment";
import { useDispatch } from "react-redux";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import {
  calendarComponnetType,
  eventType,
  TaskDetailType,
} from "@/src/utils/types";

import {
  getHeightOnPanResponderMove,
  getLastHeightOnPanResponderEnd,
  getStyleDate,
  getWeekRowsTranslateY,
  getWeekRowsOpacity,
} from "@/src/business/main/calendar";
import { KanbanItem } from "@/src/components/main/kanban/kanbanItem";
import {
  kanbanUpdateTaskGroup,
  removeTask,
  updateKanbanItemInfo,
} from "@/src/business/detail/task";
import { updateTaskAction } from "@/src/redux/updateTask/action";
import {
  showAlertDeleteNotSuccess,
  showAlertSaveNotSuccess,
} from "@/src/utils/utils";

export const CalendarModes = (props: calendarComponnetType) => {
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    selectedDate,
    calendarModes,
    mode,
    daysInMonth,
    disableChangeMode,
    events,
    groups,
    maxEventCount,
    onChangeMode,
  } = props;

  const lastMode = useRef<"monthFullScreen" | "monthHalfScreen" | "week">(
    mode as "monthFullScreen" | "monthHalfScreen" | "week"
  );

  const animatedContainerHeight = useRef(
    new Animated.Value(calendarModes[lastMode.current].height)
  ).current;
  const lastContainerHeight = useRef(calendarModes[lastMode.current].height);

  // for weekline
  const weekRowsTranslateY = useMemo(() => {
    return getWeekRowsTranslateY(
      animatedContainerHeight,
      daysInMonth,
      calendarModes,
      selectedDate
    );
  }, [animatedContainerHeight, daysInMonth, calendarModes, selectedDate]);

  const weekRowsOpacity = useMemo(() => {
    return getWeekRowsOpacity(
      animatedContainerHeight,
      daysInMonth,
      calendarModes,
      selectedDate
    );
  }, [animatedContainerHeight, daysInMonth, calendarModes, selectedDate]);

  const opacityDot = animatedContainerHeight.interpolate({
    inputRange: [
      0,
      calendarModes.monthHalfScreen.height,
      calendarModes.monthFullScreen.height,
    ],
    outputRange: [1, 1, 0],
  });

  const opacityEvent = animatedContainerHeight.interpolate({
    inputRange: [
      0,
      calendarModes.monthHalfScreen.height,
      calendarModes.monthFullScreen.height,
    ],
    outputRange: [0, 0, 1],
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => (disableChangeMode ? false : true),
    onMoveShouldSetPanResponderCapture: (e, gestureState) => {
      // Nếu vuốt theo chiều dọc thì lấy gesture
      return true;
    },
    onPanResponderMove: (event, gestureState) => {
      let { dy, dx } = gestureState;
      getHeight(dy, dx);
    },

    onPanResponderRelease: (event, gestureState) => {
      let { dy } = gestureState;
      getLastHeight(dy);
    },
  });

  const getHeight = (dy: number, dx: number) => {
    if (Math.abs(dx) < 70 && Math.abs(dy) > 0) {
      let toValue = getHeightOnPanResponderMove(
        dy,
        dx,
        lastContainerHeight.current,
        calendarModes
      );
      animatedContainerHeight.setValue(toValue);
    }
  };

  const getLastHeight = (dy: number) => {
    const { mode, value } = getLastHeightOnPanResponderEnd(
      dy,
      lastContainerHeight.current,
      calendarModes
    );

    lastContainerHeight.current = value;
    lastMode.current = mode as "monthFullScreen" | "monthHalfScreen" | "week";
    onChangeMode?.(lastMode.current);

    Animated.spring(animatedContainerHeight, {
      toValue: value,
      useNativeDriver: false,
    }).start();
  };

  const positionX = useRef<number>(0);

  const renderDate = (item: string, index: number, weekIndex: number) => {
    const { backgroundColor, titleColor, opacity, borderColor } = getStyleDate(
      item,
      selectedDate,
      index,
      colors
    );
    let events: TaskDetailType[] = props.events[item] as TaskDetailType[];
    let number = moment(item, "YYYY-MM-DD").format("D");

    const onTouchStart = (event: GestureResponderEvent) => {
      positionX.current = event.nativeEvent.locationX;
    };

    const onTouchEnd = (event: GestureResponderEvent) => {
      if (Math.abs(event.nativeEvent.locationX - positionX.current) < 2) {
        props.onChanegeDate?.(item);
      }
    };

    const bgMode =
      backgroundColor === colors.white ? colors.background : backgroundColor;
    const txtMode = titleColor === colors.dark ? colors.text : titleColor;

    return (
      <Animated.View
        style={[
          styles.date,
          {
            height: calendarModes.monthFullScreen.dateHeight,
            width: calendarModes.week.width / 7,
          },
        ]}
        pointerEvents="box-none"
      >
        <View
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          hitSlop={10}
          style={{ flex: 1 }}
        >
          <View
            style={[
              styles.numberDate,
              {
                paddingHorizontal: 10.5 - (number.length - 1) * 3,
                backgroundColor: bgMode as string,
                borderColor: borderColor as string,
                opacity: opacity as number,
              },
            ]}
          >
            <Text
              style={[
                styles.numberText,
                {
                  color: txtMode as string,
                },
              ]}
              numberOfLines={1}
            >
              {number}
            </Text>
          </View>
          <View>
            {events.length > 0 && (
              <Animated.View
                key={"event" + events[0].id}
                style={{
                  flex: 1,
                  opacity: opacityEvent,
                  position: "absolute",
                  zIndex: 20,
                }}
              >
                {events.map((event, index) => {
                  return (
                    <RenderEvent
                      key={"event" + event.id}
                      task={event}
                      index={index}
                      maxEventCount={maxEventCount}
                      eventWidth={(calendarModes.week.width / 7) * 0.8}
                    />
                  );
                })}
              </Animated.View>
            )}

            {events.length > 0 && (
              <Animated.View
                key={"event2" + events[0].id}
                style={{
                  flex: 1,
                  opacity: opacityDot,
                  position: "absolute",
                  zIndex: 20,
                  alignSelf: "center",
                }}
              >
                <View
                  key={"dot" + events[0].id}
                  style={[
                    styles.dot,
                    { backgroundColor: events[0].group.color },
                  ]}
                />
              </Animated.View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderWeeks = (item: string[], index: number) => {
    const indeWeek = index;
    return (
      <Animated.View
        key={"week" + item[0]}
        pointerEvents="box-none"
        style={{
          transform: [{ translateY: weekRowsTranslateY[index] }],
          opacity: weekRowsOpacity[index],
          position: "absolute",
          zIndex: index,
          backgroundColor: colors.white,
        }}
      >
        <FlatList
          horizontal
          scrollEnabled={false}
          data={item}
          keyExtractor={(item, index) => item}
          renderItem={({ item, index }) => renderDate(item, index, indeWeek)}
          showsHorizontalScrollIndicator={false}
        />
      </Animated.View>
    );
  };

  const onPressKanbanItem = (task: TaskDetailType) => {
    router.push(`/screens/details/task?id=${task.id}&from=kanban`);
  };

  const updateGroupTask = async (taskId: number, newGroupId: number) => {
    try {
      const oldTask = await kanbanUpdateTaskGroup(taskId, newGroupId);
      if (oldTask !== false) {
        dispatch(updateTaskAction("calendar", [oldTask.groupId, newGroupId]));
      } else {
        showAlertSaveNotSuccess(t);
      }
    } catch (error) {
      console.log("[calendar][updateGroupTask][ERROR] ----- ", error);
      showAlertSaveNotSuccess(t);
    }
  };

  const onDeleteTask = async (taskId: number, groupId: number) => {
    try {
      const result = await removeTask(taskId, groupId);
      if (result) {
        dispatch(updateTaskAction("calendar", [groupId]));
      } else {
        showAlertDeleteNotSuccess(t);
      }
    } catch (error) {
      console.log("[calendar][onDeleteTask][ERROR] ----- ", error);
      showAlertDeleteNotSuccess(t);
    }
  };

  const updateTaskInfo = async (
    taskId: number,
    groupId: number,
    value: object
  ) => {
    try {
      const result = await updateKanbanItemInfo(taskId, value);
      if (result) {
        dispatch(updateTaskAction("calendar", [groupId]));
      } else {
        showAlertSaveNotSuccess(t);
      }
    } catch (error) {
      console.log("[calendar][updateTaskInfo][ERROR] ----- ", error);
      showAlertSaveNotSuccess(t);
    }
  };

  const onSelectGroup = (task: TaskDetailType, newGroupId: number) => {
    updateGroupTask(task.id, newGroupId);
  };

  const onDelete = (task: TaskDetailType) => {
    onDeleteTask(task.id, task.groupId);
  };

  const onChangeNotification = (task: TaskDetailType, value: boolean) => {
    updateTaskInfo(task.id, task.groupId, { hasNotification: value });
  };

  const onChangeShake = (task: TaskDetailType, value: boolean) => {
    updateTaskInfo(task.id, task.groupId, { hasShake: value });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: TaskDetailType;
    index: number;
  }) => {
    return (
      <KanbanItem
        task={item}
        groups={groups}
        containerCard={{ width: calendarModes.week.width * 0.9 }}
        onPress={onPressKanbanItem}
        onSelectGroup={onSelectGroup}
        onDelete={onDelete}
        onChangeNotification={onChangeNotification}
        onChangeShake={onChangeShake}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          { height: animatedContainerHeight, width: calendarModes.week.width },
        ]}
      >
        {daysInMonth.map((week, index) => {
          return renderWeeks(week, index);
        })}
      </Animated.View>

      <View style={styles.eventsContainer}>
        <View style={styles.lineBottom}>
          <View style={styles.line} />
        </View>
        <View style={styles.eventsContent}>
          <FlashList
            data={(events[selectedDate] || []) as TaskDetailType[]}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            getItemType={(item) => item.id.toString()}
            showsVerticalScrollIndicator={true}
          />
        </View>
      </View>
    </View>
  );
};

const RenderEvent = (props: eventType) => {
  const { task, index, maxEventCount, eventWidth } = props;

  const { colors, sizes } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  if (index >= maxEventCount) return null;

  if (index === maxEventCount - 1) {
    return (
      <View key={task.id} style={styles.eventContent}>
        <Text
          style={[styles.eventText, { color: colors.primary }]}
          numberOfLines={1}
        >
          + Thêm
        </Text>
      </View>
    );
  } else if (!!task) {
    return (
      <View
        key={task.id}
        style={[
          styles.eventContent,
          { backgroundColor: task.group.color, width: eventWidth },
        ]}
      >
        <Text style={styles.eventText} numberOfLines={1}>
          {task.title}
        </Text>
      </View>
    );
  }
  return null;
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    date: {
      borderTopWidth: sizes.borderWidth.xs,
      borderRightWidth: sizes.borderWidth.xs,
      borderColor: colors.border,
      padding: size.padding.xs,
      backgroundColor: colors.background,
    },
    numberDate: {
      alignSelf: "center",
      marginVertical: sizes.margin.xs,
      paddingVertical: sizes.padding.xs,
      borderRadius: sizes.borderRadius.xs,
      borderWidth: sizes.borderWidth.xs,
    },
    numberText: {
      fontSize: size.fontSize.sm,
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.text,
    },
    eventsContainer: {
      flex: 1,
      backgroundColor: colors.background,
      position: "relative",
    },
    lineBottom: {
      height: sizes.borderWidth.xs,
      width: "100%",
      backgroundColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: -sizes.borderWidth.xs,
    },
    line: {
      width: 40,
      height: sizes.borderRadius.xs,
      borderRadius: sizes.borderRadius.xs / 2,
      backgroundColor: colors.light_gray,
      position: "absolute",
    },
    eventsContent: {
      flex: 1,
      marginTop: sizes.margin.xs,
    },
    dot: {
      height: size.padding.xs,
      width: sizes.padding.md * 2,
      borderRadius: sizes.borderRadius.xs,
      alignSelf: "center",
      marginTop: sizes.margin.xs,
    },
    eventContent: {
      padding: sizes.padding.xs / 2,
      marginTop: sizes.margin.xs / 2,
      borderRadius: sizes.borderRadius.xs,
      backgroundColor: colors.white,
      opacity: 0.8,
    },
    eventText: {
      fontSize: size.fontSize.sm,
      fontWeight: size.fontWeight.bold as "bold",
      color: colors.white,
      paddingHorizontal: sizes.padding.xs,
    },
  });
};
