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
  "UPDATE_QUERY_ID",
  // User set
  "UPDATE_USERSET_ENVS",
  "UPDATE_USERSET_PORTS",
  "UPDATE_USERSET_VOLS",
  // Others
  "INSTALL",
  "UPDATE_ENV",
  "UPDATE_DEFAULT_ENVS",
  "MANAGE_PORTS",
  "SHOULD_OPEN_PORTS",
  "FETCH_PACKAGE_DATA",
  "FETCH_PACKAGE_REQUEST",
  "UPDATE_FETCHING",
  "UPDATE_SELECTED_TYPES",
  "UPDATE_INPUT",
  "PROGRESS_LOG",
  "CLEAR_PROGRESS_LOG",
  "FETCH_DIRECTORY",
  "DISK_SPACE_AVAILABLE",
  "UPDATE_DISK_SPACE_AVAILABLE"
]);
