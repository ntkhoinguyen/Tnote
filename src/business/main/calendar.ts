import { Animated } from "react-native";
import moment from "moment";

import { selectRecordsByCondition } from "@/src/database/select";
import {
  calendarModesType,
  GroupType,
  layoutComponentType,
  TagType,
  TaskDetailType,
  TaskType,
} from "@/src/utils/types";
import {
  dayMinHeight,
  decryptedData,
  eventMaxHeight,
  monthHalfScreenMinHeight,
  textNumberDayHeight,
} from "@/src/utils/utils";

export const getDaysInMonth = (targetData: string) => {
  // lấy ngày bắt đầu của tuần cuối cùng của tháng.
  let startOfLastWeek = moment(targetData, "YYYY-MM-DD")
    .endOf("month")
    .startOf("isoWeek")
    .format("YYYY-MM-DD");
  let daysInMonth = [];
  let weekDates = [];
  for (let i = -1; i < 6; i++) {
    let startDate = moment(startOfLastWeek, "YYYY-MM-DD")
      .add(-i, "week")
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    weekDates = [];
    for (let j = 0; j < 7; j++) {
      weekDates.push(
        moment(startDate, "YYYY-MM-DD").add(j, "day").format("YYYY-MM-DD")
      );
    }
    daysInMonth.push(weekDates);
  }
  if (
    moment(daysInMonth[0][0], "YYYY-MM-DD").format("MM") !==
    moment(targetData, "YYYY-MM-DD").format("MM")
  ) {
    daysInMonth.splice(0, 1);
  }
  if (
    moment(daysInMonth[daysInMonth.length - 1][6], "YYYY-MM-DD").format(
      "MM"
    ) !== moment(targetData, "YYYY-MM-DD").format("MM")
  ) {
    daysInMonth.splice(daysInMonth.length - 1, 1);
  }
  return daysInMonth.reverse();
};

export const getLayoutCalendar = (
  targetData: string,
  layout: layoutComponentType
): null | Record<string, any> => {
  try {
    let { container, nameDays, header } = layout;
    const calendarModes = {
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
    };

    const daysInMonth = getDaysInMonth(targetData);

    // config size by mode
    calendarModes.monthFullScreen = {
      height: container.height - header.height - nameDays.height,
      width: container.width,
      dateHeight:
        (container.height - header.height - nameDays.height) /
        daysInMonth.length,
    };
    calendarModes.monthHalfScreen = {
      height: dayMinHeight * daysInMonth.length,
      width: container.width,
      dateHeight: dayMinHeight,
    };
    calendarModes.week = {
      height: dayMinHeight,
      width: container.width,
      dateHeight: dayMinHeight,
    };

    let mode = "monthHalfScreen";
    let disableChangeMode = false;
    if (
      calendarModes.monthHalfScreen.height <
        calendarModes.monthFullScreen.height &&
      calendarModes.monthHalfScreen.height >= monthHalfScreenMinHeight
    ) {
      mode = "monthHalfScreen";
      disableChangeMode = false;
    } else if (
      calendarModes.monthHalfScreen.height < monthHalfScreenMinHeight ||
      calendarModes.monthFullScreen.height <
        calendarModes.monthHalfScreen.height
    ) {
      mode = "week";
      disableChangeMode = true;
    }

    let maxEventCount = (
      (calendarModes.monthFullScreen.dateHeight - textNumberDayHeight) /
      eventMaxHeight
    ).toFixed(0);

    return {
      mode,
      disableChangeMode,
      maxEventCount,
      calendarModes,
      daysInMonth,
    };
  } catch (error) {
    console.log("[getLayoutCalendar][ERROR] ----- ", error);
    return null;
  }
};

export const getWeekRowsTranslateY = (
  animatedContainerHeight: Animated.Value,
  daysInMonth: string[][],
  calendarModes: calendarModesType,
  selectedDate: string
) => {
  let weekRowsTranslateY = [];
  let exist = false;
  for (let i = 0; i < daysInMonth.length; i++) {
    exist = daysInMonth[i].includes(selectedDate);
    weekRowsTranslateY.push(
      animatedContainerHeight.interpolate({
        inputRange: [
          calendarModes.week.height,
          calendarModes.week.height * 1.2,
          calendarModes.week.height * 1.5,
          calendarModes.week.height * 2,
          calendarModes.monthHalfScreen.height / 2,
          calendarModes.monthHalfScreen.height,
          calendarModes.monthFullScreen.height,
        ],
        outputRange: [
          exist ? 0 : -calendarModes.monthFullScreen.height,
          i *
            (calendarModes.monthHalfScreen.height / daysInMonth.length) *
            (exist ? 0.075 : 0), //w1.2
          i *
            (calendarModes.monthHalfScreen.height / daysInMonth.length) *
            0.125, //w1.5
          i *
            (calendarModes.monthHalfScreen.height / daysInMonth.length) *
            0.25, // w2
          i * (calendarModes.monthHalfScreen.height / daysInMonth.length) * 0.4,
          i * (calendarModes.monthHalfScreen.height / daysInMonth.length),
          i * (calendarModes.monthFullScreen.height / daysInMonth.length),
        ],
        extrapolate: "clamp",
      })
    );
  }
  return weekRowsTranslateY;
};

export const getWeekRowsOpacity = (
  animatedContainerHeight: Animated.Value,
  daysInMonth: string[][],
  calendarModes: calendarModesType,
  selectedDate: string
) => {
  let exist = false;
  let weekRowsOpacity = [];
  for (let i = 0; i < daysInMonth.length; i++) {
    exist = daysInMonth[i].includes(selectedDate);
    weekRowsOpacity.push(
      animatedContainerHeight.interpolate({
        inputRange: [
          calendarModes.week.height,
          calendarModes.week.height * 1.5,
          calendarModes.week.height * 2,
          calendarModes.monthHalfScreen.height / 2,
          calendarModes.monthHalfScreen.height,
        ],
        outputRange: [
          exist ? 1 : 0,
          exist ? 1 : 0.02,
          exist ? 1 : 0.1,
          exist ? 1 : 0.2,
          1,
        ],
      })
    );
  }
  return weekRowsOpacity;
};

export const getHeightOnPanResponderMove = (
  dy: number,
  dx: number,
  lastContainerHeight: number,
  calendarModes: calendarModesType
): number => {
  let toValue =
    lastContainerHeight + dy <= calendarModes.week.height
      ? calendarModes.week.height
      : lastContainerHeight + dy;
  return toValue;
};

export const getLastHeightOnPanResponderEnd = (
  dy: number,
  lastContainerHeight: number,
  calendarModes: calendarModesType
): { mode: string; value: number } => {
  let value = 0;
  let mode = "";
  if (lastContainerHeight + dy <= calendarModes.week.height) {
    mode = "week";
    value = calendarModes.week.height;
  } else if (
    lastContainerHeight + dy >= calendarModes.week.height &&
    lastContainerHeight + dy <= (calendarModes.monthHalfScreen.height * 2) / 5
  ) {
    mode = "week";
    value = calendarModes.week.height;
  } else if (
    lastContainerHeight + dy > (calendarModes.monthHalfScreen.height * 2) / 5 &&
    lastContainerHeight + dy <= calendarModes.monthHalfScreen.height
  ) {
    mode = "monthHalfScreen";
    value = calendarModes.monthHalfScreen.height;
  } else if (
    lastContainerHeight + dy > calendarModes.monthHalfScreen.height &&
    lastContainerHeight + dy <= (calendarModes.monthHalfScreen.height * 7) / 5
  ) {
    mode = "monthHalfScreen";
    value = calendarModes.monthHalfScreen.height;
  } else if (
    lastContainerHeight + dy >
    (calendarModes.monthHalfScreen.height * 7) / 5
  ) {
    mode = "monthFullScreen";
    value = calendarModes.monthFullScreen.height;
  }

  return { mode, value };
};

export const getWeekOfMonth = (date: moment.Moment) => {
  const startOfMonth = date.clone().startOf("month");
  const weekOffset = startOfMonth.week();
  const currentWeek = date.week();
  return currentWeek - weekOffset + 1;
};

export const getFormatHeader = (date: string, mode: string) => {
  let formattedDate = "";

  const dateMoment = moment(date, "YYYY-MM-DD");
  if (mode === "week") {
    const week = getWeekOfMonth(dateMoment); // Tuần trong tháng
    const month = dateMoment.format("M"); // Ví dụ: 8
    const year = dateMoment.format("YYYY");

    formattedDate = `Tuần ${week}, Tháng ${month}, ${year}`;
  } else {
    formattedDate = dateMoment.format("MMMM, YYYY");
  }
  return formattedDate;
};

export const getStyleDate = (
  date: string,
  selectedDate: string,
  dateIndex: number,
  colors: Record<string, string>
): Record<string, string | number> => {
  let backgroundColor =
    date === moment().format("YYYY-MM-DD") ? colors.primary : colors.white;
  let titleColor =
    backgroundColor === colors.primary
      ? colors.white
      : dateIndex === 6
      ? colors.red
      : colors.dark;
  let opacity =
    moment(date, "YYYY-MM-DD").format("MM") ===
    moment(selectedDate, "YYYY-MM-DD").format("MM")
      ? 1
      : 0.3;
  let borderColor =
    backgroundColor !== colors.white
      ? backgroundColor
      : date === moment(selectedDate).format("YYYY-MM-DD")
      ? colors.teal
      : colors.white;
  return {
    backgroundColor,
    titleColor,
    opacity,
    borderColor,
  };
};

export const getTaskByMonth = (selectedDate: string): Promise<TaskType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const month = moment(selectedDate, "YYYY-MM-DD").format("MM/YYYY");
      const tasks = await selectRecordsByCondition(
        "TASKS",
        `startDate LIKE ? OR endDate LIKE ?`,
        [`%${month}%`, `%${month}%`]
      );
      if (tasks) {
        for (let i = 0; i < tasks.length; i++) {
          tasks[i].content = await decryptedData(tasks[i].content);
        }
        return resolve(tasks);
      } else {
        return resolve([]);
      }
    } catch (error) {
      console.log("[Business][getTaskByMonth] -- ", error);
      return [];
    }
  });
};

export const mapTasksToDates = (
  tasks: TaskDetailType[],
  daysInMonth: string[][]
) => {
  const result: Record<string, TaskDetailType[]> = {};

  // Tạo tất cả các key từ tuần (dạng "YYYY-MM-DD") và gán mảng rỗng ban đầu
  daysInMonth.forEach((week) => {
    week.forEach((day) => {
      result[day] = [];
    });
  });

  // Duyệt từng task và đưa vào đúng ngày
  tasks.forEach((task) => {
    const startDate =
      task.startDate?.trim() !== "" ? task.startDate : task.endDate;
    let endDate = task.endDate?.trim() !== "" ? task.endDate : task.startDate;
    if (!endDate) endDate = startDate;
    for(let i = 0; ; i++) {
        const formattedDate = moment(startDate, "DD/MM/YYYY").add(i, "day").format("YYYY-MM-DD");
        if (result[formattedDate]) {
          result[formattedDate].push(task);
        }
        if (moment(formattedDate, "YYYY-MM-DD").format("DD/MM/YYYY") === moment(endDate, "DD/MM/YYYY").format("DD/MM/YYYY")) {
            break;
        }
    }
  });

  // Sort mỗi ngày theo `time` nếu có
  Object.keys(result).forEach((date) => {
    result[date].sort((a, b) => {
      const timeA = a.time?.trim() || "00:00";
      const timeB = b.time?.trim() || "00:00";

      // Giả định time là "HH:mm"
      return moment(timeA, "HH:mm").diff(moment(timeB, "HH:mm"));
    });
  });

  return result;
};

const groupDefault: GroupType = {
  color: "#0099FF",
  content: "Không có nhóm",
  id: 0,
  priority: 5,
  title: "Không có nhóm",
};

export const getTasksCustom = async (
  tasks: TaskType[],
  groups: GroupType[],
  tags: TagType[]
): Promise<TaskDetailType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newTask: TaskDetailType[] = [];
      for (let i = 0; i < tasks.length; i++) {
        const group = groups.find(
          (group: GroupType) => group.id === tasks[i].groupId
        );
        newTask[i] = {
          ...tasks[i],
          group: group || groupDefault,
          tags: tags,
        };
        newTask[i].tags = tags.filter((tag: TagType) =>
          newTask[i].tagsId.includes(tag.id)
        );
      }

      return resolve(newTask);
    } catch (error) {
      console.log("[getTasksCustom][Business][ERROR] ----- ", error);
      reject([]);
    }
  });
};
