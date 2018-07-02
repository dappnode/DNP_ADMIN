import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";
import { connectRouter, routerMiddleware } from "connected-react-router";
import history from "./history";

// Create a history of your choosing (we're using a browser history in this case)

const middleware = [thunk, routerMiddleware(history)];

// eslint-disable-next-line no-underscore-dangle
let devTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
if (
  process.env.NODE_ENV === "prod" ||
  process.env.NODE_ENV === "production" ||
  (typeof window === "object" && !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
) {
  devTools = a => a;
}

const store = createStore(
  connectRouter(history)(rootReducer), // new root reducer with router state
  compose(
    applyMiddleware(...middleware),
    // Necessary code to activate the redux chrome debug tools
    devTools
  )
);

export default store;
