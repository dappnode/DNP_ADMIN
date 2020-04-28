// DEVICES
import { api } from "API/start";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { updateDevice } from "services/devices/actions";
import { superAdminId } from "services/devices/data";
import { confirm } from "components/ConfirmDialog";
import { withToast } from "components/toast/Toast";

/* Notice: addDevice, removeDevice, etc use redux-thunk
   Since there is no return value, and the state change
   is triggered via a ws subscription there is not need
   to handle this async action in a redux-saga.

   That was the original method, but just calling the API
   directly requires less boilerplate and is more clear

   api.methodName will never throw if message is true
 */

export const addDevice = (
  id: string
): ThunkAction<void, {}, null, AnyAction> => () =>
  withToast(() => api.deviceAdd({ id }), {
    message: `Adding ${id}...`,
    onSuccess: `Added ${id}`
  });

export const removeDevice = (
  id: string
): ThunkAction<void, {}, null, AnyAction> => () =>
  confirm({
    title: `Removing ${id} device`,
    text: "The user using this device will lose access to this DAppNode ",
    label: "Remove",
    onClick: () =>
      withToast(() => api.deviceRemove({ id }), {
        message: `Removing ${id}...`,
        onSuccess: `Removed ${id}`
      })
  });

export const resetDevice = (
  id: string
): ThunkAction<void, {}, null, AnyAction> => () => {
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
      withToast(() => api.deviceReset({ id }), {
        message: `Reseting ${id}...`,
        onSuccess: `Reseted ${id}`
      })
  });
};

export const toggleAdmin = (
  id: string
): ThunkAction<void, {}, null, AnyAction> => () =>
  withToast(() => api.deviceAdminToggle({ id }), {
    message: `Toggling ${id} admin...`,
    onSuccess: `Toggled ${id} admin`
  });

export const getDeviceCredentials = (
  id: string
): ThunkAction<void, {}, null, AnyAction> => async dispatch => {
  try {
    const data = await withToast(() => api.deviceCredentialsGet({ id }), {
      onError: true
    });
    if (data) dispatch(updateDevice(id, data));
  } catch (e) {
    console.error(`Error on getDeviceCredentials`, e);
  }
};
