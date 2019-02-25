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
  "CALL",
  "REMOVE",
  "TOGGLE_ADMIN",
  "GET_DEVICE_CREDENTIALS",
  "UPDATE",
  "UPDATE_DEVICE",
  "LIST_DEVICES",
  "UPDATE_FETCHING"
]);
