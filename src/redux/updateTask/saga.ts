import { takeEvery, put, fork, select } from "redux-saga/effects";
import {
  UPDATE_TASK,
  RELOAD_SCREEN_BY_TASK_UPDATE,
  updateTaskSuccessAction,
  reLoadScreenByTaskUpdateSuccessAction,
} from "./action";
import { actionReloadScreenUpdateTaskType, actionUpdateTaskType, stateReducerType } from "@/src/utils/types";
import { SagaIterator } from "redux-saga";

export const getUpdateTaskState = (state: stateReducerType) => state.updateTask;

export function* handleUpdateTask(action: actionUpdateTaskType): SagaIterator {
  try {
    const state: ReturnType<typeof getUpdateTaskState> = yield select(
      getUpdateTaskState
    );

    let columnIds = state.screenUpdate.kanbanColumnIds || [];
    columnIds = [
      ...new Set([...columnIds, ...action.payload.value.kanbanColumnIds]),
    ];

    const reset: Record<string, boolean | number[]> = {
      notification: true,
      calendar: true,
      kanban: !(action.payload.value.fromScreen === "kanban"),
      kanbanColumnIds: columnIds,
    };

    yield put(updateTaskSuccessAction(reset));
  } catch (error: unknown) {
    console.log("[SAGA][handleUpdateTask]: ", error);
  }
}

export function* handleReloadScreenByTaskUpdate(
  action: actionReloadScreenUpdateTaskType
): SagaIterator {
  try {
    const state: ReturnType<typeof getUpdateTaskState> = yield select(
      getUpdateTaskState
    );

    let columnIds =
      action.payload.value.fromScreen === "kanban"
        ? []
        : state.screenUpdate.kanbanColumnIds;

    const reset: Record<string, boolean | number[]> = {
      ...state.screenUpdate,
      kanbanColumnIds: columnIds,
    };
    reset[action.payload.value.fromScreen] = false;

    yield put(reLoadScreenByTaskUpdateSuccessAction(reset));
  } catch (error: unknown) {
    console.log("[SAGA][handleReloadScreenByTaskUpdate]: ", error);
  }
}

export function* updateTask(): SagaIterator {
  yield takeEvery(UPDATE_TASK, handleUpdateTask);
}

export function* reloadScreenByTaskUpdate(): SagaIterator {
  yield takeEvery(RELOAD_SCREEN_BY_TASK_UPDATE, handleReloadScreenByTaskUpdate);
}

export function* updateTaskSaga(): SagaIterator {
  yield fork(updateTask);
  yield fork(reloadScreenByTaskUpdate);
}

export default updateTaskSaga;
