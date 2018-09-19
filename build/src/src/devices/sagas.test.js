import * as APIcall from "API/rpcMethods";
import { fetchDevices } from "./sagas";
import { put, call } from "redux-saga/effects";
import * as t from "./actionTypes";

describe.skip("fetchDevices Saga test", () => {
  const gen = fetchDevices();
  it("Should call the API endpoint fetchDevices", () => {
    expect(gen.next().value).toEqual(call(APIcall.fetchDevices));
  });

  it("Should dispatch an action to update the device list", () => {
    const devices = "devices";
    expect(gen.next(devices).value).toEqual(put({ type: t.UPDATE, devices }));
  });

  it("should be done", () => {
    expect(gen.next().done).toEqual(true);
  });
});
