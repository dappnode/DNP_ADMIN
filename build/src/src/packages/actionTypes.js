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
  "LOG_PACKAGE",
  "LIST_PACKAGES",
  "UPDATE_FETCHING",
  "UPDATE_LOG",
  "UPDATE_PACKAGES",
  "HAS_FETCHED_PACKAGES",
  // File manager
  "COPY_FILE_FROM"
]);
