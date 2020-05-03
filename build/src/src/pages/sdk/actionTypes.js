import { mountPoint } from "./data";

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

/**
 * ### Todo: delete this util
 *
 * Utility to ease the addition of actionTypes
 *
 * @param {string} moduleId = 'moduleName', name of the module
 * @param {array} actionTypes = [
 *   "UPDATE_DAPPNODE_IDENTITY",
 *   "PUSH_NOTIFICATION",
 *   ...
 * ]
 * @returns {object} actionTypes object = {
 *   UPDATE_DAPPNODE_IDENTITY: "moduleName/UPDATE_DAPPNODE_IDENTITY",
 *   PUSH_NOTIFICATION: "moduleName/PUSH_NOTIFICATION",
 *   ...
 * }
 */
function generateActionTypes(moduleId, actionTypes) {
  const obj = {};
  actionTypes.forEach(actionType => {
    // prefixing each type with the module name helps preventing name collisions
    obj[actionType] = moduleId + "/" + actionType;
  });
  return obj;
}
