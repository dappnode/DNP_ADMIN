import { mountPoint } from "./data";
import generateActionTypes from "utils/generateActionTypes";

/**
 * Generates the actionTypes object = {
 * This utility eases the addition of new actionTypes, and ensures a common format
 */
export default generateActionTypes(mountPoint, [
  "UPDATE_REGISTRY",
  "UPDATE_REPO",
  "FETCH_REGISTRY",
  "VALIDATE_REPO_NAME",
  "UPDATE_REPO_NAME",
  "UPDATE_QUERY",
  "UPDATE_QUERY_RESULT",
  "CONNECT_METAMASK",
  "PUBLISH",
  "UPDATE_UI_MESSAGE"
]);
