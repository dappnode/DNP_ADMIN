import { createStore, applyMiddleware, compose } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import history from "./history";
import createSagaMiddleware from "redux-saga";
import eventBus from "eventBus";

// App modules
import rootSaga from "./rootSaga";
import rootReducer from "./rootReducer";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middleware = [
  routerMiddleware(history),
  // mount saga middleware on the Store
  sagaMiddleware
];

// eslint-disable-next-line no-underscore-dangle
let devTools =
  typeof window === "object" && !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // In production: pass an empty function. This can prevent unexpected errors
      a => a
    : // In development: activate the devtools extension
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
  connectRouter(history)(rootReducer), // new root reducer with router state
  compose(
    applyMiddleware(...middleware),
    // Necessary code to activate the redux chrome debug tools
    devTools
  )
);

eventBus.subscribe("ACTION", (topic, action) => {
  store.dispatch(action);
});

export default store;

// Run the saga
sagaMiddleware.run(rootSaga);
