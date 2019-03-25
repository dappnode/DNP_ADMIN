// INSTALLER
import * as t from "./actionTypes";
import { shortName as sn } from "utils/format";
import api from "API/rpcMethods";

// Used in package root

export const updatePackages = packages => ({
  type: "UPDATE_INSTALLED_PACKAGES",
  packages
});

// Used in package interface / logs
// #### TODO: refactor to sagas

export const updateLog = (logs, id) => ({
  type: t.UPDATE_LOG,
  logs,
  id
});

export const logPackage = (id, options) => ({
  type: t.FETCH_DNP_LOGS,
  id,
  options
});

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

export const restartPackage = id => () =>
  api.restartPackage({ id }, { toastMessage: `Restarting ${sn(id)}...` });

export const restartPackageVolumes = id => () =>
  api.restartPackageVolumes(
    { id },
    { toastMessage: `Restarting ${sn(id)} volumes...` }
  );

export const removePackage = (id, deleteVolumes) => () =>
  api.removePackage(
    { id, deleteVolumes },
    {
      toastMessage: `Removing ${sn(id)} ${
        deleteVolumes ? " and volumes" : ""
      }...`
    }
  );

// File manager

export const copyFileTo = ({ id, dataUri, toPath }) => () =>
  api.copyFileTo(
    { id, dataUri, toPath },
    { toastMessage: `Copying file to ${sn(id)} ${toPath}...` }
  );

export const copyFileFrom = ({ id, fromPath }) => ({
  type: t.COPY_FILE_FROM,
  id,
  fromPath
});
