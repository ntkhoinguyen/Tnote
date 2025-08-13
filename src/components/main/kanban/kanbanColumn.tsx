import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity, LogBox } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useIsFocused } from "@react-navigation/native";

import { useAppContext } from "@/src/useHook/useAppContext";
import { defaultColors } from "@/src/themes/colors";
import { sizes } from "@/src/themes/sizes";
import {
  kanbanItemWidth,
  kanbanColumnWidth,
  showAlertSaveNotSuccess,
  showAlertDeleteNotSuccess,
} from "@/src/utils/utils";
import {
  KanbanColumnType,
  stateReducerType,
  TaskDetailType,
} from "@/src/utils/types";
import { LoadingIcon } from "@/src/components/loadingIcon";
import { KanbanItem } from "@/src/components/main/kanban/kanbanItem";

import {
  getTaskByGroupId,
  getTasksCustom,
  getSequencesByGroupId,
  getTaskCount,
  kanbanUpdateTaskGroup,
  removeTask,
  updateKanbanItemInfo,
  kanbanSortSequence,
} from "@/src/business/detail/task";

import {
  reLoadScreenByTaskUpdateAction,
  updateTaskAction,
} from "@/src/redux/updateTask/action";

const limit = 5;
LogBox.ignoreLogs([
  "ref.measureLayout must be called with a ref to a native component",
]);

export const KanbanColumn = (props: KanbanColumnType) => {
  const { group, tags, groups, searchText = "", onOpenImage } = props;
  const router = useRouter();
  const { colors, sizes, t } = useAppContext();
  const styles = useMemo(() => createStyles(colors, sizes), [colors, sizes]);

  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  const isReloadScreen = useSelector(
    (state: stateReducerType) => state.updateTask.screenUpdate.kanban
  );

  const kanbanColumnIds = useSelector(
    (state: stateReducerType) => state.updateTask.screenUpdate.kanbanColumnIds
  );

  const [count, setCount] = useState(0);
  const [tasks, setTasks] = useState<TaskDetailType[]>([]);
  const limitTask = useRef(limit);
  const [isLoadmore, setIsLoadmore] = useState(false);

  const isMount = useRef(true);

  const getData = async () => {
    try {
      const count = await getTaskCount(group.id, searchText);
      const sequences = await getSequencesByGroupId(group.id);
      const tasksOrigin = await getTaskByGroupId(
        group.id,
        limitTask.current,
        searchText
      );
      const taskCustom = await getTasksCustom(
        tasksOrigin,
        group,
        tags,
        sequences
      );
      setCount(count);
      setTasks(taskCustom);
    } catch (error) {
      console.log("[getData][KanbanColumn][ERROR] ----- ", error);
    }
  };

  // init and listen search change
  useEffect(() => {
    getData();
    isMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, groups, tags]);

  useEffect(() => {
    const reload = async () => {
      await getData();
    };

    if (isFocus && !isMount.current) {
      if (isReloadScreen || kanbanColumnIds.includes(group.id)) {
        reload();
        dispatch(reLoadScreenByTaskUpdateAction("kanban"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, group.id, isFocus, isReloadScreen, kanbanColumnIds]);

  const getDataMore = async () => {
    limitTask.current += limit;
    setIsLoadmore(true);
    await getData();
    setIsLoadmore(false);
  };

  const onPressKanbanItem = (task: TaskDetailType) => {
    router.push(`/screens/details/task?id=${task.id}&from=kanban`);
  };

  const updateGroupTask = async (taskId: number, newGroupId: number) => {
    try {
      const oldTask = await kanbanUpdateTaskGroup(taskId, newGroupId);
      if (oldTask !== false) {
        dispatch(updateTaskAction("kanban", [oldTask.groupId, newGroupId]));
      } else {
        showAlertSaveNotSuccess(t);
      }
    } catch (error) {
      console.log("[updateGroupTask][ERROR] ----- ", error);
      showAlertSaveNotSuccess(t);
    }
  };

  const onDeleteTask = async (taskId: number) => {
    try {
      const result = await removeTask(taskId, group.id);
      if (result) {
        dispatch(updateTaskAction("kanban", [group.id]));
      } else {
        showAlertDeleteNotSuccess(t);
      }
    } catch (error) {
      console.log("[onDeleteTask][ERROR] ----- ", error);
      showAlertDeleteNotSuccess(t);
    }
  };

  const updateTaskInfo = async (taskId: number, value: object) => {
    try {
      const result = await updateKanbanItemInfo(taskId, value);
      if (result) {
        dispatch(updateTaskAction("kanban", [group.id]));
      } else {
        showAlertSaveNotSuccess(t);
      }
    } catch (error) {
      console.log("[updateTaskInfo][ERROR] ----- ", error);
      showAlertSaveNotSuccess(t);
    }
  };

  const onSelectGroup = (task: TaskDetailType, newGroupId: number) => {
    updateGroupTask(task.id, newGroupId);
  };

  const onDelete = (task: TaskDetailType) => {
    onDeleteTask(task.id);
  };

  const onChangeNotification = (task: TaskDetailType, value: boolean) => {
    updateTaskInfo(task.id, { hasNotification: value });
  };

  const onChangeShake = (task: TaskDetailType, value: boolean) => {
    updateTaskInfo(task.id, { hasShake: value });
  };

  const sortData = async (data: TaskDetailType[]) => {
    try {
      const result = await kanbanSortSequence(
        group.id,
        data.map((item) => item.id)
      );
      if (result) {
        setTasks(data);
      } else {
        showAlertSaveNotSuccess(t);
      }
    } catch (error) {
      console.log("[sortData][ERROR] ----- ", error);
      showAlertSaveNotSuccess(t);
    }
  };

  const itemSeparatorComponent = useCallback(() => {
    return <View style={{ width: 8 }}></View>;
  }, []);

  const onDragEnd = ({ data }: { data: TaskDetailType[] }) => {
    sortData(data);
  };

  const renderItemDrag = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<TaskDetailType>) => {
    return (
      <ScaleDecorator>
        <KanbanItem
          task={item}
          groups={groups}
          disabled={isActive}
          onPress={onPressKanbanItem}
          onLongPress={drag}
          onSelectGroup={onSelectGroup}
          onDelete={onDelete}
          onChangeNotification={onChangeNotification}
          onChangeShake={onChangeShake}
          onOpenImage={onOpenImage}
        />
      </ScaleDecorator>
    );
  };

  const renderLoadmore = () => {
    if (tasks.length >= count) return null; // No more tasks to load
    return (
      <TouchableOpacity style={styles.loadmore} onPress={getDataMore}>
        {!isLoadmore ? (
          <Text style={styles.loadmoreText}>{t("loadmore")}</Text>
        ) : (
          <LoadingIcon size={"small"} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* group name */}
      <View style={styles.groupNameContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.groupName, { color: group.color, flexShrink: 1 }]}
        >
          {group.title}
        </Text>
        <Text style={[styles.groupNameCount]}>({count})</Text>
      </View>
      {/* list card */}
      <View style={styles.content}>
        <NestableScrollContainer>
          <NestableDraggableFlatList
            data={tasks}
            onDragEnd={onDragEnd}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItemDrag}
            showsVerticalScrollIndicator={false}
            activationDistance={50}
            ItemSeparatorComponent={itemSeparatorComponent}
            ListFooterComponent={renderLoadmore}
          />
        </NestableScrollContainer>
      </View>
    </View>
  );
};

const createStyles = (colors: typeof defaultColors, size: typeof sizes) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: kanbanColumnWidth,
    },
    groupNameContainer: {
      padding: sizes.padding.sm,
      paddingHorizontal: sizes.padding.md,
      borderRadius: size.borderRadius.sm,
      backgroundColor: colors.kanbanGroupName,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center", // Căn giữa theo chiều dọc
      width: kanbanItemWidth,
      alignSelf: "center",
    },
    groupName: {
      fontSize: size.fontSize.lg,
      fontWeight: size.fontWeight.bold as "bold",
      marginRight: sizes.margin.sm,
      flexGrow: 1, // Cho phép title chiếm phần lớn không gian còn lại
    },
    groupNameCount: {
      fontSize: size.fontSize.lg,
      fontWeight: size.fontWeight.bold as "bold",
      opacity: 0.5,
      flexShrink: 0, // Ngăn count thu nhỏ
      color: colors.text,
    },
    content: {
      flex: 1,
    },
    loadmore: {
      height: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    loadmoreText: {
      fontSize: size.fontSize.lg,
      color: colors.primary,
    },
  });
};
