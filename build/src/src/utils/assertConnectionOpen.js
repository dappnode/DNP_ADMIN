import { select, take } from "redux-saga/effects";
import { getIsConnectionOpen } from "services/connectionStatus/selectors";

export default function* assertConnectionOpen() {
  const connectionOpen = yield select(getIsConnectionOpen);
  if (!connectionOpen) {
    yield take("CONNECTION_OPEN");
  }
}
