// NAVBAR
import { NAME } from "./constants";

// prefixing each type with the module name helps preventing name collisions
const type = tag => NAME + "/" + tag;

function generateTypes(actionTypes) {
  const obj = {};
  actionTypes.forEach(actionType => {
    obj[actionType] = type(actionType);
  });
  return obj;
}

export default generateTypes([
  "UPDATE_DAPPNODE_IDENTITY",
  "PUSH_NOTIFICATION",
  "VIEWED_NOTIFICATIONS",
  "REMOVE_DAPPMANAGER_NOTIFICATIONS"
]);
