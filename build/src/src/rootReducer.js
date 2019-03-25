import { combineReducers } from "redux";
import services from "./services";
import pages from "./pages";

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

export default combineReducers({
  ...servicesReducers,
  ...pagesReducers
});
