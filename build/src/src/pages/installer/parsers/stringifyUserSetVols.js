/**
 * Convert "old_path:/root/.local": {
 *   host: "new_path",
 *   container: "/root/.local"
 *   accessMode: "ro"
 * }
 * To "old_path:/root/.local:ro": "new_path:/root/.local:ro"
 */
export default function stringifyUserSetVols(userSetVols) {
  const userSetVolsParsed = {};
  for (const dnpName of Object.keys(userSetVols)) {
    userSetVolsParsed[dnpName] = {};
    for (const id of Object.keys(userSetVols[dnpName])) {
      const { host, container, accessMode } = userSetVols[dnpName][id];
      userSetVolsParsed[dnpName][id] = [host, container, accessMode]
        .filter(x => x)
        .join(":");
    }
  }
  return userSetVolsParsed;
}
