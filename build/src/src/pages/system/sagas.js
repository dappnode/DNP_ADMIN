import { call, put } from "redux-saga/effects";
// This page
import * as t from "./actionTypes";
// External actions
import { pushNotification } from "services/notifications/actions";
import { fetchDappnodeParams } from "services/dappnodeStatus/actions";
import { fetchDevices } from "services/devices/actions";
// Utilities
import api from "API/rpcMethods";
import { rootWatcher } from "utils/redux";

/***************************** Subroutines ************************************/

function* setStaticIp({ staticIp }) {
  try {
    yield call(
      api.setStaticIp,
      { staticIp },
      { toastMessage: "setting static ip...", throw: true }
    );

    // Show notification to upgrade VPN profiles
    yield put(
      pushNotification({
        notification: {
          id: "staticIpUpdated",
          type: "warning",
          title: "Update connection profiles",
          body:
            "Your static IP was changed, please download and install your VPN connection profile again. Instruct your users to do so also."
        }
      })
    );

    // Refresh App state
    yield put(fetchDappnodeParams());
    yield put(fetchDevices());
  } catch (e) {
    console.error(`Error on setStaticIp: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [[t.SET_STATIC_IP, setStaticIp]];

export default rootWatcher(watchers);
