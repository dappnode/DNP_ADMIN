import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";

// App modules
import rootSaga from "./rootSaga";
import rootReducer from "./rootReducer";

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
  rootReducer, // new root reducer with router state,
  composedEnhancers(applyMiddleware(...middlewares))
);

// ##### DEV
window.dispach = store.dispatch;
window.store = store;

export default store;

// Run the saga
sagaMiddleware.run(rootSaga);
