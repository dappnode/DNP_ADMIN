// WATCHERS
import { NAME } from "./constants";
import generateActionTypes from "utils/generateActionTypes";

/**
 * Generates the actionTypes object = {
 *   UPDATE_DAPPNODE_IDENTITY: "navbar/UPDATE_DAPPNODE_IDENTITY",
 *   PUSH_NOTIFICATION: "navbar/PUSH_NOTIFICATION",
 *   ...
 * }
 *
 * This utility eases the addition of new actionTypes, and ensures a common format
 */
export default generateActionTypes(NAME, [
  "UPDATE_DAPPNODE_STATS",
  "GET_DAPPNODE_STATS"
]);
