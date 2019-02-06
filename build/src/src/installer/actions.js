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

export const updateUserSetEnvs = ({ dnpName, envName, value }) => ({
  type: t.UPDATE_USERSET_ENVS,
  dnpName,
  envName,
  value
});

export const updateUserSetPorts = ({ dnpName, envName, envValue }) => ({
  type: t.UPDATE_USERSET_PORTS,
  dnpName,
  envName,
  envValue
});

export const updateUserSetVols = ({ dnpName, envName, envValue }) => ({
  type: t.UPDATE_USERSET_VOLS,
  dnpName,
  envName,
  envValue
});
