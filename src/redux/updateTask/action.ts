import { actionUpdateTaskType } from "@/src/utils/types";
import { screenReloadTask } from "@/src/utils/utils";

export const UPDATE_TASK = "UPDATE_TASK";
export const UPDATE_TASK_SUCCESS = "UPDATE_TASK_SUCCESS";
export const RELOAD_SCREEN_BY_TASK_UPDATE = "RELOAD_SCREEN_BY_TASK_UPDATE";
export const RELOAD_SCREEN_BY_TASK_UPDATE_SUCCESS =
  "RELOAD_SCREEN_BY_TASK_UPDATE_SUCCESS";

type fromScreenType = (typeof screenReloadTask)[keyof typeof screenReloadTask];
type kanbanColumnIdsType = number[];
export const updateTaskAction = (
  fromScreen: fromScreenType,
  kanbanColumnIds: kanbanColumnIdsType
): actionUpdateTaskType => {
  return {
    type: UPDATE_TASK,
    payload: { value: { fromScreen, kanbanColumnIds } },
  };
};

export const updateTaskSuccessAction = (
  data: Record<keyof typeof screenReloadTask, boolean | number[]>
) => {
  return {
    type: UPDATE_TASK_SUCCESS,
    payload: { value: data },
  };
};

export const reLoadScreenByTaskUpdateAction = (fromScreen: fromScreenType) => {
  return {
    type: RELOAD_SCREEN_BY_TASK_UPDATE,
    payload: { value: { fromScreen } },
  };
};

export const reLoadScreenByTaskUpdateSuccessAction = (
  data: Record<string, boolean | number[]>
) => {
  return {
    type: RELOAD_SCREEN_BY_TASK_UPDATE_SUCCESS,
    payload: { value: data },
  };
};
