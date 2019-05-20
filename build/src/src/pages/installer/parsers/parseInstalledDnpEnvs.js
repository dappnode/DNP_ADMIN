/**
 * @param {object} dnp = { envs: { "ENV_NAME": "ENV_VALUE" } }
 * @return {object} envs = {
 *   "ENV_NAME": { name: "ENV_NAME", value: "ENV_VALUE" }
 * }
 */
export default function parseInstalledDnpEnvs(dnp) {
  const envs = (dnp || {}).envs || {};
  return Object.entries(envs).reduce((obj, [name, value]) => {
    obj[name] = { name, value };
    return obj;
  }, {});
}
