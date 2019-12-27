import * as t from "./actionTypes";
import { confirm } from "components/ConfirmDialog";
import * as api from "API/calls";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
// External actions
import { fetchIfPasswordIsInsecure } from "services/dappnodeStatus/actions";

// pages > system

export const setStaticIp = (staticIp: string) => ({
  type: t.SET_STATIC_IP,
  staticIp
});

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
