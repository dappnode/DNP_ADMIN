import { select, take } from "redux-saga/effects";

function connectionOpenSelector(state) {
  return state.session && state.session.isOpen;
}

export default function* assertConnectionOpen() {
  const connectionOpen = yield select(connectionOpenSelector);
  if (!connectionOpen) {
    yield take("CONNECTION_OPEN");
  }
}
