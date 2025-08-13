import {
  UPDATE_TASK_SUCCESS,
  RELOAD_SCREEN_BY_TASK_UPDATE_SUCCESS,
} from "@/src/redux/updateTask/action";

const updateTaskState = {
  screenUpdate: {
    notification: false,
    calendar: false,
    kanban: false,
    kanbanColumnIds: [],
  },
};

type actionType = { type: string; payload: { value: any } };

function updateTaskReducer(state = updateTaskState, action: actionType | any) {
  switch (action.type) {
    case UPDATE_TASK_SUCCESS:
      return {
        ...state,
        screenUpdate: {
          ...state.screenUpdate,
          ...action.payload.value,
        },
      };
    case RELOAD_SCREEN_BY_TASK_UPDATE_SUCCESS:
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
export default updateTaskReducer;
