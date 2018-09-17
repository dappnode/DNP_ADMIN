import * as APIcall from "API/rpcMethods";
import { listPackages } from "./sagas";
import { put, call } from "redux-saga/effects";
import * as actions from "./actions";

describe("listPackages Saga test on normal behaviour", () => {
  const packages = "packages";
  const gen = listPackages();

  it("Should call the API endpoint fetchPackageData", () => {
    expect(gen.next().value).toEqual(call(APIcall.listPackages));
  });

  it("Should dispatch an action to update the package list", () => {
    expect(gen.next(packages).value).toEqual(
      put(actions.updatePackages(packages))
    );
  });

  it("should be done", () => {
    expect(gen.next().done).toEqual(true);
  });
});
