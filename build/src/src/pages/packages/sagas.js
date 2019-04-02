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

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [[t.COPY_FILE_FROM, copyFileFrom]];

export default rootWatcher(watchers);
