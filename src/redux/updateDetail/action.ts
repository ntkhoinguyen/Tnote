import { actionUpdateDetailsType } from "@/src/utils/types";
import { screenReload } from "@/src/utils/utils";

export const UPDATE_DETAILS = "UPDATE_DETAILS";
export const UPDATE_DETAILS_SUCCESS = "UPDATE_DETAILS_SUCCESS";
export const RELOAD_SCREEN_BY_DETAIL_UPDATE = "RELOAD_SCREEN_BY_DETAIL_UPDATE";
export const RELOAD_SCREEN_BY_DETAIL_UPDATE_SUCCESS =
  "RELOAD_SCREEN_BY_DETAIL_UPDATE_SUCCESS";

type fromScreenType = (typeof screenReload)[keyof typeof screenReload];
export const updateDetailAction = (
  fromScreen: fromScreenType
): actionUpdateDetailsType => {
  return {
    type: UPDATE_DETAILS,
    payload: { value: { fromScreen } },
  };
};

export const updateDetailSuccessAction = (
  data: Record<keyof typeof screenReload, boolean>
) => {
  return {
    type: UPDATE_DETAILS_SUCCESS,
    payload: { value: data },
  };
};

export const reLoadScreenByDetailUpdateAction = (
  fromScreen: fromScreenType
) => {
  return {
    type: RELOAD_SCREEN_BY_DETAIL_UPDATE,
    payload: { value: { fromScreen } },
  };
};

export const reLoadScreenByDetailUpdateSuccessAction = (
  data: Record<keyof typeof screenReload, boolean>
) => {
  return {
    type: RELOAD_SCREEN_BY_DETAIL_UPDATE_SUCCESS,
    payload: { value: data },
  };
};
