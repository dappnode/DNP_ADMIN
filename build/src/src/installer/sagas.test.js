import * as APIcall from "API/crossbarCalls";
import {
  fetchDirectory,
  fetchPackageData,
  fetchPackageVersions
} from "./sagas";
import { put, call } from "redux-saga/effects";
import * as t from "./actionTypes";

describe("fetchDirectory Saga test on normal behaviour", () => {
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
    expect(value.ALL[0]).toEqual(call(fetchPackageData, directory[0]));
    expect(value.ALL[1]).toEqual(call(fetchPackageData, directory[1]));
  });

  it("should be done", () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe("fetchDirectory Saga test when an error happens", () => {
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

describe("fetchPackageData Saga test on normal behaviour", () => {
  const id = "packageA";
  const pkg = { name: id, version: "0.0.1" };
  const data = { manifest: "manifest" };
  const gen = fetchPackageData(pkg);

  it("Should dispatch an action to update the package right away", () => {
    expect(gen.next().value).toEqual(
      put({ type: t.UPDATE_PACKAGE, data: pkg, id })
    );
  });

  it("Should call the API endpoint fetchPackageData", () => {
    expect(gen.next().value).toEqual(call(APIcall.fetchPackageData, { id }));
  });

  it("Should dispatch an action to update the package again", () => {
    expect(gen.next(data).value).toEqual(
      put({ type: t.UPDATE_PACKAGE, data, id })
    );
  });

  it("should be done", () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe("fetchPackageVersions Saga test on normal behaviour", () => {
  const id = "packageA";
  const action = { kwargs: { id } };
  const gen = fetchPackageVersions(action);
  const versions = [{ version: "0.0.1" }, { version: "0.0.2" }];
  it("Should call the API endpoint fetchDirectory", () => {
    expect(gen.next(versions).value).toEqual(
      call(APIcall.fetchPackageVersions, action.kwargs)
    );
  });

  it("Should dispatch an action to update the versions", () => {
    expect(gen.next(versions).value).toEqual(
      put({ type: t.UPDATE_PACKAGE, data: { versions }, id: action.kwargs.id })
    );
  });

  it("should be done", () => {
    expect(gen.next().done).toEqual(true);
  });
});
