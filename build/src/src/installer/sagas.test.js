import * as APIcall from "API/rpcMethods";
import {
  fetchDirectory,
  fetchPackageData,
  fetchPackageVersions
} from "./sagas";
import { put, call } from "redux-saga/effects";
import * as t from "./actionTypes";

describe.skip("fetchDirectory Saga test on normal behaviour", () => {
  const gen = fetchDirectory();
  const directory = [{ name: "package A" }, { name: "package B" }];
  it("Should call the API endpoint fetchDirectory", () => {
    gen.next(); // Update fetching
    expect(gen.next().value).toEqual(call(APIcall.fetchDirectory));
    gen.next(directory); // Update fetching
  });

  it("Should dispatch an action to update the directory", () => {
    expect(gen.next().value).toEqual(
      put({ type: t.UPDATE_DIRECTORY, directory })
    );
  });

  it("Should call fetchPackageData for each package", () => {
    const value = gen.next().value;
    expect(value.ALL).toHaveLength(2);
  });

  it("should be done", () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe.skip("fetchDirectory Saga test when an error happens", () => {
  const gen = fetchDirectory();
  const directory = undefined; // Error
  it("Should call the API endpoint fetchDirectory", () => {
    gen.next(); // Update fetching
    expect(gen.next().value).toEqual(call(APIcall.fetchDirectory));
    gen.next(directory); // Update fetching
  });

  it("should be done", () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe.skip("fetchPackageData Saga test on normal behaviour", () => {
  const id = "packageA";
  const data = { manifest: "manifest" };
  const gen = fetchPackageData({ id });

  it("Should dispatch an action to update the package right away", () => {
    expect(gen.next().value).toEqual(
      put({ type: t.UPDATE_PACKAGE_DATA, data: { fetching: true }, id })
    );
  });

  it("Should call the API endpoint fetchPackageData", () => {
    expect(gen.next().value).toEqual(call(APIcall.fetchPackageData, { id }));
  });

  it("Should dispatch an action to update the package again", () => {
    expect(gen.next(data).value).toEqual(
      put({
        type: t.UPDATE_PACKAGE_DATA,
        data: { ...(data || { error: true }), fetching: false },
        id
      })
    );
  });

  it("should be done", () => {
    expect(gen.next().done).toEqual(true);
  });
});
