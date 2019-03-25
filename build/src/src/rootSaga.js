import { all } from "redux-saga/effects";

import services from "./services";
import pages from "./pages";

/* eslint-disable redux-saga/no-unhandled-errors */
// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    ...Object.values(services)
      .filter(service => service.saga)
      .map(service => service.saga()),
    ...Object.values(pages)
      .filter(page => page.saga)
      .map(page => page.saga())
  ]);
}
