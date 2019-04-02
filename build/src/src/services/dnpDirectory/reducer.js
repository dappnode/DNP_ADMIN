import * as t from "./actionTypes";
import merge from "deepmerge";
import { assertAction } from "utils/redux";
import { arrayToObj } from "utils/objects";

// Service > dnpDirectory

/**
 * @param state = dnps = {
 *   "bitcoin.dnp.dappnode.eth": {
 *     name: "bitcoin.dnp.dappnode.eth",
 *     manifest: {},
 *     avatar: {Base64Img}
 *     ...
 *   }, ... }
 * [Tested]
 */

// Prevent manifest arrays to keep populating
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;
const mergeOverwriteArrays = (a, b) => merge(a, b, overwriteMerge);

export default (state = {}, action) => {
  switch (action.type) {
    case t.UPDATE_DNP_DIRECTORY:
      // Patch to ensure action.dnps is an object, if it is an array
      action.dnps = Array.isArray(action.dnps)
        ? arrayToObj(action.dnps, "name")
        : action.dnps;
      // Assuming this function is only called to fetch the DNPs from the DAPPMANAGER
      // DNPs will be whitelisted
      assertAction(action, { dnps: {} });
      Object.keys(action.dnps).forEach(key => {
        action.dnps[key].whitelisted = true;
      });
      return mergeOverwriteArrays(state, action.dnps);

    case t.UPDATE_DNP_DIRECTORY_BY_ID:
      assertAction(action, { id: "dnp", dnp: {} });
      return mergeOverwriteArrays(state, { [action.id]: action.dnp });

    default:
      return state;
  }
};
