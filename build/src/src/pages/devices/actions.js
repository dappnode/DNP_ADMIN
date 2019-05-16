// DEVICES
import api from "API/rpcMethods";
import { updateDevice } from "services/devices/actions";
import { superAdminId } from "services/devices/data";
import { confirm } from "components/ConfirmDialog";

/* Notice: addDevice, removeDevice, etc use redux-thunk
   Since there is no return value, and the state change
   is triggered via a ws subscription there is not need
   to handle this async action in a redux-saga.

   That was the original method, but just calling the API
   directly requires less boilerplate and is more clear

   api.methodName will never throw if toastMessage is true
 */

export const addDevice = id => () =>
  api.addDevice({ id }, { toastMessage: `Adding ${id}...` });

export const removeDevice = id => () =>
  confirm({
    title: `Removing ${id} device`,
    text: "The user using this device will lose access to this DAppNode ",
    label: "Remove",
    onClick: () =>
      api.removeDevice({ id }, { toastMessage: `Removing ${id}...` })
  });

export const resetDevice = id => () => {
  const isSuperAdmin = id === superAdminId;
  confirm({
    title: isSuperAdmin
      ? `WARNING! Reseting super admin`
      : `Reseting ${id} device`,
    text: isSuperAdmin
      ? "You should only reset the credentials of the super admin if you suspect an unwanted party gained access to this credentials. If that is the case, reset the credentials, BUT download and install the new credentials IMMEDIATELY. Otherwise, you will lose access to your DAppNode when this connection stops"
      : "All profiles and links pointing to this device will no longer be valid",
    label: `Reset`,
    onClick: () =>
      api.resetDevice({ id }, { toastMessage: `Reseting ${id}...` })
  });
};

export const toggleAdmin = id => () =>
  api.toggleAdmin({ id }, { toastMessage: `Toggling ${id} admin...` });

export const getDeviceCredentials = id => dispatch =>
  api.getDeviceCredentials({ id }, { toastOnError: true }).then(data => {
    dispatch(updateDevice(id, data));
  });
