import { all } from "redux-saga/effects";

import devices from "./devices";
import installer from "./installer";
import packages from "./packages";
import system from "./system";
import status from "./status";
import activity from "./activity";
import navbar from "./navbar";
import dashboard from "./dashboard";
import troubleshoot from "./troubleshoot";
import sdk from "./sdk";

const modules = [
  devices,
  installer,
  packages,
  system,
  status,
  activity,
  navbar,
  dashboard,
  troubleshoot,
  sdk
];

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all(modules.filter(m => m.saga).map(m => m.saga()));
}
