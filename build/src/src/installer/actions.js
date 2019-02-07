// INSTALLER
import t from "./actionTypes";

export const updateFetching = fetching => ({
  type: t.UPDATE_FETCHING,
  fetching
});

export const updateFetchingRequest = (id, fetching) => ({
  type: "UPDATE_DIRECTORY",
  pkgs: { [id]: { fetchingRequest: fetching } }
});

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

export const fetchPackageRequest = id => ({
  type: t.FETCH_PACKAGE_REQUEST,
  id
});

export const install = kwargs => ({
  type: t.INSTALL,
  ...kwargs
});

// Need to notify the chain that a package has been added

export const updateEnv = ({ id, envs, isCORE }) => ({
  type: t.UPDATE_ENV,
  envs,
  id,
  isCORE
});

export const updateDefaultEnvs = ({ id }) => ({
  type: t.UPDATE_DEFAULT_ENVS,
  id
});

export const openPorts = ports => ({
  type: t.MANAGE_PORTS,
  action: "open",
  ports
});

// Package install query dependant

export const updateQueryId = id => ({
  type: t.UPDATE_QUERY_ID,
  id
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

export const setShowAdvancedSettings = value => ({
  type: t.SET_SHOW_ADVANCED_SETTINGS,
  value
});

export const clearUserSet = () => ({
  type: t.CLEAR_USERSET
});
