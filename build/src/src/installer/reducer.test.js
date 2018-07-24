import reducer from "installer/reducer";
import * as t from "installer/actionTypes";

describe("Packages reducer", () => {
  it("has a default state", () => {
    expect(reducer(undefined, { type: undefined }).packages).toEqual({});
  });

  it("updates unexistent package correctly", () => {
    const data = { version: "0.0.1" };
    const id = "pkgA";
    expect(
      reducer(undefined, {
        type: t.UPDATE_PACKAGE,
        data,
        id
      }).packages
    ).toEqual({ [id]: data });
  });

  it("updates existent package correctly", () => {
    const data = { version: "0.0.1" };
    const id = "pkgA";
    const pkg = { manifest: "manifest" };
    const packages = { [id]: pkg };
    const state = { packages };
    expect(
      reducer(state, {
        type: t.UPDATE_PACKAGE,
        data,
        id
      }).packages
    ).toEqual({ [id]: { ...data, ...pkg } });
  });
});
