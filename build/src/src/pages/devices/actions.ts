import { api } from "api";
import { confirm } from "components/ConfirmDialog";
import { withToastNoThrow } from "components/toast/Toast";
import { superAdminId } from "params";
import { AppThunk } from "store";

// Notice: addDevice, removeDevice, etc use redux-thunk Since there is no return
// value, and the state change is triggered via a ws subscription

export const addDevice = (id: string): AppThunk => () =>
  withToastNoThrow(() => api.deviceAdd({ id }), {
    message: `Adding ${id}...`,
    onSuccess: `Added ${id}`
  });

export const removeDevice = (id: string): AppThunk => () =>
  confirm({
    title: `Removing ${id} device`,
    text: "The user using this device will lose access to this DAppNode ",
    label: "Remove",
    onClick: () =>
      withToastNoThrow(() => api.deviceRemove({ id }), {
        message: `Removing ${id}...`,
        onSuccess: `Removed ${id}`
      })
  });

export const resetDevice = (id: string): AppThunk => () => {
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
      withToastNoThrow(() => api.deviceReset({ id }), {
        message: `Reseting ${id}...`,
        onSuccess: `Reseted ${id}`
      })
  });
};

export const toggleAdmin = (id: string): AppThunk => () =>
  withToastNoThrow(() => api.deviceAdminToggle({ id }), {
    message: `Toggling ${id} admin...`,
    onSuccess: `Toggled ${id} admin`
  });
