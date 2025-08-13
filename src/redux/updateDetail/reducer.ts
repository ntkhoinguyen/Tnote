import { screenReload } from "@/src/utils/utils";
import {
  UPDATE_DETAILS_SUCCESS,
  RELOAD_SCREEN_BY_DETAIL_UPDATE_SUCCESS,
} from "@/src/redux/updateDetail/action";

const updateDetailState = {
  screenUpdate: {
    [screenReload.groupDetail]: false,
    [screenReload.tagDetail]: false,
    [screenReload.tagScreen]: false,
    [screenReload.notiScreen]: false,
    [screenReload.homeScreen]: false,
    [screenReload.taskDetail]: false,
  },
};

type actionType = { type: string; payload: { value: any } };

function updateDetailReducer(
  state = updateDetailState,
  action: actionType | any
) {
  switch (action.type) {
    case UPDATE_DETAILS_SUCCESS:
      return {
        ...state,
        screenUpdate: {
          ...state.screenUpdate,
          ...action.payload.value,
        },
      };
    case RELOAD_SCREEN_BY_DETAIL_UPDATE_SUCCESS:
      return {
        ...state,
        screenUpdate: {
          ...state.screenUpdate,
          ...action.payload.value,
        },
      };

    default:
      return state;
  }
}
export default updateDetailReducer;
