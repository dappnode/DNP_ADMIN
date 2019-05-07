// INSTALLER
import * as t from "./actionTypes";

export const updateInput = id => ({
  type: t.UPDATE_INPUT,
  payload: id
});

export const updateSelectedTypes = types => ({
  type: t.UPDATE_SELECTED_TYPES,
  payload: types
});

export const fetchDirectory = () => ({
  type: t.FETCH_DIRECTORY
});

export const fetchPackageData = id => ({
  type: t.FETCH_PACKAGE_DATA,
  id
});

// Special action that uses a feature to suppress errors on
// DAPPMANAGER internal and userActionLogs
export const fetchPackageDataFromQuery = query => ({
  type: t.FETCH_PACKAGE_DATA,
  id: query,
  dontLogError: true
});

export const fetchPackageRequest = id => ({
  type: t.FETCH_PACKAGE_REQUEST,
  id
});

export const install = (id, options) => ({
  type: t.INSTALL,
  id,
  options
});

export const openPorts = ports => ({
  type: t.MANAGE_PORTS,
  action: "open",
  ports
});

export const updateUserSetEnvs = ({ dnpName, key, value }) => ({
  type: t.UPDATE_USERSET_ENVS,
  dnpName,
  key,
  value
});

// "bitcoin.dnp.dappnode.eth": {
//   "30303:30303/udp": {
//     host: "30304",
//     container: "30303",
//     type: "udp"
//   }
// }
export const updateUserSetPorts = ({ dnpName, id, host, container, type }) => ({
  type: t.UPDATE_USERSET_PORTS,
  dnpName,
  id,
  values: { host, container, type }
});

// "bitcoin.dnp.dappnode.eth": {
//   "/usr/src/config:/data/.chain/config:ro": {
//     host: "/usr/src/config",
//     container: "/data/.chain/config",
//     accessMode: "ro"
//   },
//   "bitcoin_data:/data/.chain/var": {
//     container: "/data/.chain/var",
//     host: "bitcoin_data"
//   }
// }
export const updateUserSetVols = ({
  dnpName,
  id,
  host,
  container,
  accessMode
}) => ({
  type: t.UPDATE_USERSET_VOLS,
  dnpName,
  id,
  values: { host, container, ...(accessMode ? { accessMode } : {}) }
});

export const clearUserSet = () => ({
  type: t.CLEAR_USERSET
});
