import { put, takeEvery, all } from "redux-saga/effects";

function* helloSaga() {
  console.log("Hello Sagas!");
}

function* byeSaga() {
  console.log("Bye Sagas!");
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([helloSaga(), byeSaga()]);
}
