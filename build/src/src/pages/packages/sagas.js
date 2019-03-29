import { call, put } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import APIcall from "API/rpcMethods";
import * as t from "./actionTypes";
import * as a from "./actions";
import Toast from "components/toast/Toast";
import { shortName } from "utils/format";
import dataUriToBlob from "utils/dataUriToBlob";
import { saveAs } from "file-saver";

/***************************** Subroutines ************************************/

function* copyFileFrom({ id, fromPath }) {
  try {
    const pendingToast = new Toast({
      message: `Copying file from ${shortName(id)} ${fromPath}...`,
      pending: true
    });
    const res = yield call(APIcall.copyFileFrom, { id, fromPath });
    pendingToast.resolve(res);
    // If result, process dataUri = res.result
    if (res.success && res.result) {
      const dataUri = res.result;
      const blob = dataUriToBlob(dataUri);
      const fileName = fromPath.split("/")[fromPath.split("/").length - 1];
      saveAs(blob, fileName);
    }
  } catch (error) {
    console.error(`Error on copyFileFrom ${id} ${fromPath}: `, error);
  }
}

function* fetchDnpLogs({ id, options }) {
  try {
    if (!id) throw Error("id must be defined");
    if (!options || typeof options !== "object")
      throw Error("options must be defined and type object");
    const res = yield call(APIcall.logPackage, { id, options });
    if (res.success) {
      const { logs } = res.result || {};
      if (!logs) {
        yield put(a.updateLog("Error, logs missing", id));
      } else if (logs === "") {
        yield put(a.updateLog("Received empty logs", id));
      } else {
        yield put(a.updateLog(logs, id));
      }
    } else {
      yield put(a.updateLog("Error logging package: \n" + res.message, id));
      // Emit an event to instruct the DNP log UI to stop asking for logs
      // ##### TODO: Find a cleaner way to achieve this
      window.dispatchEvent(new Event("LOG_ERROR"));
    }
  } catch (e) {
    console.error("Error getting package logs:", e);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [t.FETCH_DNP_LOGS, fetchDnpLogs],
  [t.COPY_FILE_FROM, copyFileFrom]
];

export default rootWatcher(watchers);
