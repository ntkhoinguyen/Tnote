import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import updateDetailReducer from "./updateDetail/reducer";
import updateTaskReducer from "./updateTask/reducer";

import { updateDetailSaga } from "./updateDetail/saga";
import { updateTaskSaga } from "./updateTask/saga";
import { fork } from "redux-saga/effects";

export const rootReducer = combineReducers({
  updateDetail: updateDetailReducer,
  updateTask: updateTaskReducer,
});

export const rootSaga = function* rootSaga() {
  yield fork(updateDetailSaga);
  yield fork(updateTaskSaga);
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const createSagaMiddlewareDefault = require("redux-saga").default;
const sagaMiddleware =
  createSagaMiddleware?.() ?? createSagaMiddlewareDefault();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
