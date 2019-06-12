// INSTALLER
import * as t from "./actionTypes";
import { confirm } from "components/ConfirmDialog";
import { shortNameCapitalized as sn } from "utils/format";
// Selectors
import { getDnpDirectoryById } from "services/dnpDirectory/selectors";
// Parsers
import parseSpecialPermissions from "./parsers/parseSpecialPermissions";

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

export const install = (id, options) => async (dispatch, getState) => {
  const dnp = getDnpDirectoryById(getState(), id);

  // Special permissions
  const specialPermissions = parseSpecialPermissions(dnp.manifest);
  if (specialPermissions.length)
    await new Promise(resolve =>
      confirm({
        title: `Special permissions`,
        text: `${id} needs:`,
        list: specialPermissions.map(({ name, details }) => ({
          title: name,
          body: details
        })),
        label: "Accept",
        onClick: resolve,
        variant: "dappnode"
      })
    );

  // Dialog to accept the disclaimer if any
  const disclaimer = (dnp.manifest || {}).disclaimer;
  if (disclaimer)
    await new Promise(resolve =>
      confirm({
        title: `${sn(id)} disclaimer`,
        text: disclaimer.message,
        label: "Accept",
        onClick: resolve,
        variant: "dappnode"
      })
    );

  dispatch({ type: t.INSTALL, id, options });
};

export const openPorts = ports => ({
  type: t.MANAGE_PORTS,
  action: "open",
  ports
});

// "bitcoin.dnp.dappnode.eth": {
//   "ENV_NAME": {
//     name: "ENV_NAME",
//     value: "ENV_VALUE"
//   }
// }
export const updateUserSetEnvs = ({ dnpName, id, name, value }) => ({
  type: t.UPDATE_USERSET_ENVS,
  dnpName,
  id,
  values: { name, value }
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
