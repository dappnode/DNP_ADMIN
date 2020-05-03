import { createStore, applyMiddleware, Action } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk, { ThunkAction } from "redux-thunk";
import createSagaMiddleware from "redux-saga";

// App modules
import rootSaga from "./rootSaga";
import rootReducer, { RootState } from "./rootReducer";

/**
 * To reduce repetition, you might want to define a reusable AppThunk
 * type once, in your store file, and then use that type whenever
 * you write a thunk:
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  thunk,
  // mount saga middleware on the Store
  sagaMiddleware
];

// Methodology from https://redux.js.org/recipes/configuring-your-store#integrating-the-devtools-extension
// And https://github.com/zalmoxisus/redux-devtools-extension#13-use-redux-devtools-extension-package-from-npm
const actionsBlacklist = ["UPDATE_CHAIN_DATA"];
const composedEnhancers = composeWithDevTools({ actionsBlacklist });

const store = createStore(
  rootReducer as any, // new root reducer with router state,
  composedEnhancers(applyMiddleware(...middlewares))
);

// ##### DEV
// @ts-ignore
window.dispach = store.dispatch;
// @ts-ignore
window.store = store;

export default store;

// Run the saga
sagaMiddleware.run(rootSaga);
