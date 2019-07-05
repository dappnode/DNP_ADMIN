/**
 * Convert "ENV_NAME": {
 *   name: "ENV_NAME",
 *   value: "ENV_VALUE",
 * }
 * To "ENV_NAME": "ENV_VALUE"
 */
export default function getUserSetEnvsStringified(userSetEnvs) {
  const userSetEnvsParsed = {};
  for (const dnpName of Object.keys(userSetEnvs)) {
    userSetEnvsParsed[dnpName] = {};
    for (const { name, value } of Object.values(userSetEnvs[dnpName])) {
      userSetEnvsParsed[dnpName][name] = value;
    }
  }
  return userSetEnvsParsed;
}
