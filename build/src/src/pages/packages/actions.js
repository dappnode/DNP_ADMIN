// INSTALLER
import { confirm } from "components/ConfirmDialog";
import { shortNameCapitalized as sn } from "utils/format";
import api from "API/rpcMethods";
// Selectors
import { getDnpInstalledById } from "services/dnpInstalled/selectors";

/* Notice: togglePackage, restartPackage, etc use redux-thunk
   Since there is no return value, and the state change
   is triggered via a ws subscription there is not need
   to handle this async action in a redux-saga.

   That was the original method, but just calling the API
   directly requires less boilerplate and is more clear

   api.methodName will never throw if toastMessage is true
 */

// Used in package interface / envs

export const updatePackageEnv = (id, envs) => () =>
  api.updatePackageEnv(
    { id, envs, restart: true },
    { toastMessage: `Updating ${id} envs: ${JSON.stringify(envs)}...` }
  );

// Used in package interface / controls

export const togglePackage = id => () =>
  api.togglePackage({ id }, { toastMessage: `Toggling ${sn(id)}...` });

export const restartPackage = id => (_, getState) => {
  const restartPackageCallback = () =>
    api.restartPackage({ id }, { toastMessage: `Restarting ${sn(id)}...` });

  // If the DNP is gracefully stopped, do not ask for confirmation to reset
  const dnp = getDnpInstalledById(getState(), id);
  if (dnp && !dnp.running && dnp.state === "exited")
    return restartPackageCallback();

  // Display a dialog to confirm restart
  confirm({
    title: `Restarting ${sn(id)}`,
    text: `This action cannot be undone. If this DNP holds state, it may be lost.`,
    label: "Restart",
    onClick: restartPackageCallback
  });
};

export const restartPackageVolumes = id => (_, getState) => {
  // Make sure there are no colliding volumes with this DNP

  // If there are NOT conflicting volumes,
  // Display a dialog to confirm volumes reset
  confirm({
    title: `Removing ${sn(id)} data`,
    text: `This action cannot be undone. If this DNP is a blockchain node, it will lose all the chain data and start syncing from scratch.`,
    label: "Remove volumes",
    onClick: () =>
      api.restartPackageVolumes(
        { id },
        { toastMessage: `Removing volumes of ${sn(id)}...` }
      )
  });
};

export const removePackage = id => (_, getState) => {
  // Dialog to confirm remove + USER INPUT for delete volumes
  const removePackageCallback = deleteVolumes =>
    api.removePackage(
      { id, deleteVolumes },
      {
        toastMessage: `Removing ${sn(id)} ${
          deleteVolumes ? " and volumes" : ""
        }...`
      }
    );
  confirm({
    title: `Removing ${sn(id)}`,
    text: `This action cannot be undone. If you do NOT want to keep ${id}'s data, remove it permanently clicking the "Remove DNP + data" option.`,
    buttons: [
      { label: "Remove", onClick: () => removePackageCallback(false) },
      {
        label: "Remove DNP + data",
        onClick: () => removePackageCallback(true)
      }
    ]
  });
};

// File manager

export const copyFileTo = ({ id, dataUri, filename, toPath }) => () =>
  api.copyFileTo(
    { id, dataUri, filename, toPath },
    { toastMessage: `Copying file ${filename} to ${sn(id)} ${toPath}...` }
  );

// DAPPMANAGER dedicated cleanCache RPC

export const cleanCache = () => () =>
  confirm({
    title: `Deleting cache`,
    text: `This action cannot be undone. You should only clean the cache in response to a problem.`,
    label: "Clean cache",
    onClick: () => api.cleanCache({}, { toastMessage: `Cleaning cache...` })
  });
