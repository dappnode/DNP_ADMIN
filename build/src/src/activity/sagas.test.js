import * as APIcall from "API/crossbarCalls";
import { getUserActionLogs } from "./sagas";
import { put, call } from "redux-saga/effects";
import * as t from "./actionTypes";

describe.skip("getUserActionLogs Saga test on normal behaviour", () => {
  const gen = getUserActionLogs();
  const directory = [{ name: "package A" }, { name: "package B" }];
  it("Should call the API endpoint getUserActionLogs", () => {
    gen.next(); // Update fetching
    expect(gen.next().value).toEqual(call(APIcall.getUserActionLogs));
    gen.next(directory); // Update fetching
  });

  it("Should dispatch an action to update the directory", () => {
    expect(gen.next().value).toEqual(
      put({ type: t.UPDATE_DIRECTORY, directory })
    );
  });

  it("should be done", () => {
    expect(gen.next().done).toEqual(true);
  });
});
