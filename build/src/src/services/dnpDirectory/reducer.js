import merge from "deepmerge";
import * as t from "./actionTypes";

// Prevent manifest arrays to keep populating
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

export default (state = {}, action) => {
  switch (action.type) {
    case t.UPDATE_DNP_DIRECTORY:
      return merge(state, action.dnps || {}, { arrayMerge: overwriteMerge });

    default:
      return state;
  }
};
