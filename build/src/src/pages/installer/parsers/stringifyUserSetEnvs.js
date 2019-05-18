/**
 * Convert "ENV_NAME": {
 *   name: "ENV_NAME",
 *   value: "ENV_VALUE",
 * }
 * To "ENV_NAME": "ENV_VALUE"
 */
export default function getUserSetEnvsStringified(userSetEnvs) {
  // HOST:CONTAINER/type, return [HOST, CONTAINER/type]
  // CONTAINER/type, return [null, CONTAINER/type]
  const userSetEnvsParsed = {};
  for (const dnpName of Object.keys(userSetEnvs)) {
    userSetEnvsParsed[dnpName] = {};
    for (const { name, value } of Object.values(userSetEnvs[dnpName])) {
      userSetEnvsParsed[dnpName][name] = value;
    }
  }
  return userSetEnvsParsed;
}
