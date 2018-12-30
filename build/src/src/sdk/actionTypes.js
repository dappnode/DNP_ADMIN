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
  "UPDATE_REGISTRY",
  "UPDATE_REPO",
  "FETCH_REGISTRY",
  "VALIDATE_REPO_NAME",
  "UPDATE_REPO_NAME",
  "UPDATE_QUERY",
  "UPDATE_QUERY_RESULT"
]);
