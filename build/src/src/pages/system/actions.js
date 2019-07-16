import * as t from "./actionTypes";
import { confirm } from "components/ConfirmDialog";
import api from "API/rpcMethods";
// External actions
import { fetchIfPasswordIsInsecure } from "services/dappnodeStatus/actions";

// pages > system

export const setStaticIp = staticIp => ({
  type: t.SET_STATIC_IP,
  staticIp
});

export const passwordChange = newPassword => dispatch => {
  // Display a dialog to confirm the password change
  confirm({
    title: `Changing host user password`,
    text: `Make sure to safely store this password and keep a back up. \n\nYou will never be able to see this password again. If you lose it, you will not be able to recover it in any way.`,
    label: "Change",
    variant: "dappnode",
    onClick: () =>
      api
        .passwordChange(
          { newPassword },
          { toastMessage: `Changing host user password...` }
        )
        .then(() => {
          dispatch(fetchIfPasswordIsInsecure());
        })
  });
};
