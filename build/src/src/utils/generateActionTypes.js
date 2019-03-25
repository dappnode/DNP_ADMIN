/**
 * Utility to ease the addition of actionTypes
 *
 * @param {String} moduleId = 'moduleName', name of the module
 * @param {Array} actionTypes = [
 *   "UPDATE_DAPPNODE_IDENTITY",
 *   "PUSH_NOTIFICATION",
 *   ...
 * ]
 * @returns {Object} actionTypes object = {
 *   UPDATE_DAPPNODE_IDENTITY: "moduleName/UPDATE_DAPPNODE_IDENTITY",
 *   PUSH_NOTIFICATION: "moduleName/PUSH_NOTIFICATION",
 *   ...
 * }
 */
export default function generateActionTypes(moduleId, actionTypes) {
  const obj = {};
  actionTypes.forEach(actionType => {
    // prefixing each type with the module name helps preventing name collisions
    obj[actionType] = moduleId + "/" + actionType;
  });
  return obj;
}
