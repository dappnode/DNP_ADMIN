import { combineReducers } from "redux";
import services from "./services";
import pages from "./pages";
// For injecting mock data
import reduceReducers from "reduce-reducers";
import merge from "deepmerge";

const servicesReducers = {};
Object.values(services).forEach(({ mountPoint, reducer }) => {
  servicesReducers[mountPoint] = reducer;
});

// Map pages to reducers:
const pagesReducers = {};
Object.values(pages).forEach(({ rootPath, mountPoint, reducer }) => {
  if (!mountPoint) mountPoint = "page_temp_" + rootPath;
  if (reducer) pagesReducers[mountPoint] = reducer;
});

/**
 * Special reducer that has access to the entire store
 * Ref: https://github.com/redux-utilities/reduce-reducers
 * - Used in index.js to replace the state with mock content
 */
const globalReducer = function(state, action) {
  return action.type === "DEV_ONLY_REPLACE_STATE"
    ? merge(state, action.state)
    : state;
};
export default reduceReducers(
  combineReducers({
    ...servicesReducers,
    ...pagesReducers
  }),
  globalReducer
);
