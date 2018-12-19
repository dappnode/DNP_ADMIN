/**
 * Utility to ease the addition of actionTypes
 *
 * @param {String} NAME = 'navbar', name of the module
 * @param {Array} actionTypes = [
 *   "UPDATE_DAPPNODE_IDENTITY",
 *   "PUSH_NOTIFICATION",
 *   ...
 * ]
 * @returns {Object} actionTypes object = {
 *   UPDATE_DAPPNODE_IDENTITY: "navbar/UPDATE_DAPPNODE_IDENTITY",
 *   PUSH_NOTIFICATION: "navbar/PUSH_NOTIFICATION",
 *   ...
 * }
 */
export default function generateActionTypes(NAME, actionTypes) {
  const obj = {};
  actionTypes.forEach(actionType => {
    // prefixing each type with the module name helps preventing name collisions
    obj[actionType] = NAME + "/" + actionType;
  });
  return obj;
}
