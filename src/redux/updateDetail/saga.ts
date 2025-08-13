import { takeEvery, put, fork, select } from "redux-saga/effects";
import {
  UPDATE_DETAILS,
  RELOAD_SCREEN_BY_DETAIL_UPDATE,
  updateDetailSuccessAction,
  reLoadScreenByDetailUpdateSuccessAction,
} from "./action";
import { actionReloadScreenUpdateDetailsType, actionUpdateDetailsType, stateReducerType } from "@/src/utils/types";
import { screenReload } from "@/src/utils/utils";
import { SagaIterator } from "redux-saga";

export const getUpdateDetailState = (state: stateReducerType) => state.updateDetail;

export function* handleUpdateDetails(action: actionUpdateDetailsType): SagaIterator {
  try {
    // Tạo reset với tất cả key từ screenReload, đặt giá trị là true
    const reset: Record<string, boolean> = {};
    Object.keys(screenReload).forEach((key) => {
      reset[key] = true;
    });
    const newState: Record<string, boolean> = {
      ...reset,
      [action.payload.value.fromScreen]: false,
    };
    yield put(updateDetailSuccessAction(newState));
  } catch (error: unknown) {
    console.log("[SAGA][handleUpdateDetails]: ", error);
  }
}

export function* handleReloadScreenByDetailUpdate(action: actionReloadScreenUpdateDetailsType): SagaIterator {
  try {
    const state: ReturnType<typeof getUpdateDetailState> = yield select(getUpdateDetailState);
    // Kiểm tra xem state.screenUpdate có tồn tại không
    if (!state.screenUpdate) {
      throw new Error("state.screenUpdate is undefined");
    }
    const newState: Record<string, boolean> = {
      ...state.screenUpdate,
      [action.payload.value.fromScreen]: false,
    };
    yield put(reLoadScreenByDetailUpdateSuccessAction(newState));
  } catch (error: unknown) {
    console.log("[SAGA][handleReloadScreenByDetailUpdate]: ", error);
  }
}

export function* updateDetail(): SagaIterator {
  yield takeEvery(UPDATE_DETAILS, handleUpdateDetails);
}

export function* reloadScreenByDetailUpdate(): SagaIterator {
  yield takeEvery(RELOAD_SCREEN_BY_DETAIL_UPDATE, handleReloadScreenByDetailUpdate);
}

export function* updateDetailSaga(): SagaIterator {
  yield fork(updateDetail);
  yield fork(reloadScreenByDetailUpdate);
}

export default updateDetailSaga;