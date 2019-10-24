import { mountPoint } from "./data";
import { createSelector } from "reselect";
import _ from "lodash";

// Service > dnpRequest

export const getLocal = createSelector(
  state => state[mountPoint],
  local => local
);

export const getDnpRequest = (state, requestId) => getLocal(state)[requestId];
