import api from "API/rpcMethods";

export default async function pingDnp(dnp) {
  try {
    return await api[dnp].ping;
  } catch (e) {
    console.warn(`Error on pingDnp(${dnp}): ${e.stack}`);
    return null;
  }
}
