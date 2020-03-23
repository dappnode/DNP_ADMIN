import * as t from "./actionTypes";
import { confirm } from "components/ConfirmDialog";
import * as api from "API/calls";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { shortNameCapitalized, prettyVolumeName } from "utils/format";
import { getEthClientPrettyName } from "components/EthMultiClient";
// External actions
import { fetchIfPasswordIsInsecure } from "services/dappnodeStatus/actions";
// Selectors
import { getDnpInstalledById } from "services/dnpInstalled/selectors";
import { getEthClientTarget } from "services/dappnodeStatus/selectors";
import { EthClientTarget } from "types";

// pages > system

export const setStaticIp = (staticIp: string) => ({
  type: t.SET_STATIC_IP,
  staticIp
});

// Redux Thunk actions

export const changeEthClientTarget = (
  nextTarget: EthClientTarget
): ThunkAction<void, {}, null, AnyAction> => async (_, getState) => {
  const prevTarget = getEthClientTarget(getState());

  // Make sure the target has changed or the call will error
  if (nextTarget === prevTarget) return;

  // If the previous target is package, ask the user if deleteVolumes
  const deleteVolumes =
    prevTarget && prevTarget !== "remote"
      ? await new Promise((resolve: (_deleteVolumes: boolean) => void) =>
          confirm({
            title: `Remove ${getEthClientPrettyName(prevTarget)} volumes?`,
            text: `Do you want to keep or remove the volumes of your current Ethereum client? This action cannot be undone.`,
            buttons: [
              {
                label: "Keep",
                variant: "dappnode",
                onClick: () => resolve(false)
              },
              {
                label: "Remove",
                variant: "danger",
                onClick: () => resolve(true)
              }
            ]
          })
        )
      : false;

  await api
    .ethClientTargetSet(
      { target: nextTarget, deleteVolumes },
      { toastMessage: "Changing Eth client..." }
    )
    .catch(console.error);
};

export const passwordChange = (
  newPassword: string
): ThunkAction<void, {}, null, AnyAction> => async dispatch => {
  // Display a dialog to confirm the password change
  await new Promise(resolve =>
    confirm({
      title: `Changing host user password`,
      text: `Make sure to safely store this password and keep a back up. \n\nYou will never be able to see this password again. If you lose it, you will not be able to recover it in any way.`,
      label: "Change",
      variant: "dappnode",
      onClick: resolve
    })
  );

  await api.passwordChange(
    { newPassword },
    { toastMessage: `Changing host user password...` }
  );

  dispatch(fetchIfPasswordIsInsecure());
};

export const volumeRemove = (
  name: string
): ThunkAction<void, {}, null, AnyAction> => async dispatch => {
  // Display a dialog to confirm the password change
  await new Promise(resolve =>
    confirm({
      title: `Removing volume`,
      text: `Are you sure you want to permanently remove volume ${name}?`,
      label: "Remove",
      variant: "danger",
      onClick: resolve
    })
  );

  await api.volumeRemove({ name }, { toastMessage: `Removing volume...` });
};

export const packageVolumeRemove = (
  dnpName: string,
  volName: string
): ThunkAction<void, {}, null, AnyAction> => async (dispatch, getState) => {
  // Make sure there are no colliding volumes with this DNP
  const dnp = getDnpInstalledById(getState(), dnpName);
  const prettyDnpName = shortNameCapitalized(dnpName);
  const prettyVolName = prettyVolumeName(volName, dnpName).name;
  const prettyVolRef = `${prettyDnpName} ${prettyVolName} volume`;

  const warningsList: { title: string; body: string }[] = [];
  /**
   * If there are volumes which this DNP is the owner and some other
   * DNPs are users, they will be removed by the DAPPMANAGER.
   * Alert the user about this fact
   */
  if (dnp) {
    const vol = dnp.volumes.find(vol => vol.name === volName);
    if (vol && vol.users) {
      const externalUsers = vol.users.filter(d => d !== dnpName);
      if (externalUsers.length > 0) {
        warningsList.push({
          title: "Warning! DAppNode Packages to be removed",
          body: `Some other DAppNode Packages will be reseted in order to remove ${prettyVolRef}. \n\n ${externalUsers
            .map(name => `- ${name}`)
            .join("\n")}`
        });
      }
    }
  }

  // If there are NOT conflicting volumes,
  // Display a dialog to confirm volumes reset
  await new Promise(resolve =>
    confirm({
      title: `Removing ${prettyVolRef}`,
      text: `Are you sure you want to permanently remove this volume? This action cannot be undone. If this DAppNode Package is a blockchain node, it will lose all the chain data and start syncing from scratch.`,
      list: warningsList.length ? warningsList : null,
      label: "Remove",
      onClick: resolve
    })
  );

  await api.restartPackageVolumes(
    { id: dnpName, volumeId: volName },
    { toastMessage: `Removing ${prettyVolRef}...` }
  );
};
