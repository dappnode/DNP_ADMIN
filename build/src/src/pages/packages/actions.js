// INSTALLER
import { confirm } from "components/ConfirmDialog";
import { shortNameCapitalized as sn } from "utils/format";
import api from "API/rpcMethods";
// Selectors
import { getCollidingVolumesById } from "services/dnpInstalled/selectors";

function ensureNoConflictingVolumes(state, id, callback) {
  // Make sure there are no colliding volumes with this DNP
  const collidingVolumes = getCollidingVolumesById(state, id);
  if (collidingVolumes.length)
    // If there are conflicting volumes,
    // display a dialog indicating the problem
    // and stop the restart (don't let the user restart the DNP's volumes)
    confirm({
      title: `Conflicting volumes`,
      text: `${sn(id)} has conflicting volumes. ${collidingVolumes
        .map(vol => `Volume ${vol.name} is also used by ${vol.dnps.join(", ")}`)
        .join(
          ". "
        )}. You must remove the conflicting DNPs (DAppNode packages) OR this one first, and THEN you will be able to remove the volumes.`
    });
  // If there are NOT conflicting volumes, proceed
  else callback();
}

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

export const restartPackage = id => () => {
  // Display a dialog to confirm restart
  confirm({
    title: `Restarting ${sn(id)}`,
    text: `This action cannot be undone. If this DNP holds state, it may be lost.`,
    label: "Restart",
    onClick: () =>
      api.restartPackage({ id }, { toastMessage: `Restarting ${sn(id)}...` })
  });
};

export const restartPackageVolumes = id => (_, getState) => {
  // Make sure there are no colliding volumes with this DNP
  ensureNoConflictingVolumes(getState(), id, () => {
    // If there are NOT conflicting volumes,
    // Display a dialog to confirm volumes reset
    confirm({
      title: `Removing ${sn(id)} data`,
      text: `This action cannot be undone. If this DNP is a blockchain node, it will lose all the chain data and start syncing from scratch.`,
      label: "Remove volumes",
      onClick: () =>
        api.restartPackageVolumes(
          { id },
          { toastMessage: `Restarting ${sn(id)} volumes...` }
        )
    });
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
        onClick: () =>
          // Make sure there are no colliding volumes with this DNP
          // This callback will close a dialog modal. There MUST be a setTimeout
          // to open the next dialog AFTER the first one has closed, otherwise won't open
          setTimeout(
            () =>
              ensureNoConflictingVolumes(getState(), id, () =>
                removePackageCallback(true)
              ),
            0
          )
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
