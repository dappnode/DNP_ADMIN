import { all } from "redux-saga/effects";

import chainDataSaga from "services/chainData/sagas";
import coreUpdateSaga from "services/coreUpdate/sagas";
import dappnodeStatusSaga from "services/dappnodeStatus/sagas";
import dnpInstalledSaga from "services/dnpInstalled/sagas";
import notificationsSaga from "services/notifications/sagas";

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    chainDataSaga(),
    coreUpdateSaga(),
    dappnodeStatusSaga(),
    dnpInstalledSaga(),
    notificationsSaga()
  ]);
}
