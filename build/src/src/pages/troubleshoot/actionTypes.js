import { mountPoint } from "./data";
import generateActionTypes from "utils/generateActionTypes";

/**
 * Generates the actionTypes object = {
 * This utility eases the addition of new actionTypes, and ensures a common format
 */
export default generateActionTypes(mountPoint, [
  "DIAGNOSE",
  "UPDATE_DIAGNOSE",
  "CLEAR_DIAGNOSE",
  "COMPUTE_ISSUE_URL",
  "UPDATE_ISSUE_URL",
  "UPDATE_INFO"
]);
