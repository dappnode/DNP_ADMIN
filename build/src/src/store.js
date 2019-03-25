import { createStore, applyMiddleware } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import history from "./history";
import createSagaMiddleware from "redux-saga";
import eventBus from "eventBus";

// App modules
import rootSaga from "./rootSaga";
import rootReducer from "./rootReducer";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  routerMiddleware(history),
  thunk,
  // mount saga middleware on the Store
  sagaMiddleware
];

// Methodology from https://redux.js.org/recipes/configuring-your-store#integrating-the-devtools-extension
// And https://github.com/zalmoxisus/redux-devtools-extension#13-use-redux-devtools-extension-package-from-npm
const actionsBlacklist = ["UPDATE_CHAIN_DATA"];
const composedEnhancers = composeWithDevTools({ actionsBlacklist });

const store = createStore(
  connectRouter(history)(rootReducer), // new root reducer with router state
  composedEnhancers(applyMiddleware(...middlewares))
);

eventBus.subscribe("ACTION", (_, action) => {
  store.dispatch(action);
});

export default store;

// Run the saga
sagaMiddleware.run(rootSaga);
