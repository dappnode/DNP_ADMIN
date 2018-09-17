import reducer from "packages/reducer";
import * as t from "packages/actionTypes";

describe.skip("Packages reducer", () => {
  it("has a default state", () => {
    expect(reducer(undefined, { type: undefined }).packages).toEqual([]);
  });

  it("updates packages correctly", () => {
    const packages = [{ pkgA: "pkgA" }];
    expect(
      reducer(undefined, {
        type: t.UPDATE_PACKAGES,
        packages
      }).packages
    ).toEqual(packages);
  });
});

describe.skip("Logs reducer", () => {
  it("has a default state", () => {
    expect(reducer(undefined, { type: undefined }).logs).toEqual({});
  });

  it("updates logs correctly", () => {
    const logs = "logs";
    const id = "pkgA";
    expect(
      reducer(undefined, {
        type: t.UPDATE_LOG,
        logs,
        id
      }).logs
    ).toEqual({ [id]: logs });
  });
});
