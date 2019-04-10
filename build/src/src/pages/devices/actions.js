// DEVICES
import api from "API/rpcMethods";
import { updateDevice } from "services/devices/actions";

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
  api.removeDevice({ id }, { toastMessage: `Removing ${id}...` });

export const resetDevice = id => () =>
  api.resetDevice({ id }, { toastMessage: `Reseting ${id}...` });

export const toggleAdmin = id => () =>
  api.toggleAdmin({ id }, { toastMessage: `Toggling ${id} admin...` });

export const getDeviceCredentials = id => dispatch =>
  api
    .getDeviceCredentials(
      { id },
      { toastMessage: `Getting ${id} credentials...` }
    )
    .then(data => {
      dispatch(updateDevice(id, data));
    });
