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
  // Core update action
  "UPDATE_CORE_DEPS",
  "UPDATE_CORE_MANIFEST",
  "UPDATE_CORE",
  // Static IP
  "SET_STATIC_IP",
  "UPDATE_STATIC_IP",
  "UPDATE_STATIC_IP_INPUT"
]);
