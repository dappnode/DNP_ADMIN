import isIp from "./isIp";

describe("utils > isIp", () => {
  it("returns true for an IP", () => {
    expect(isIp("192.168.0.1")).toEqual(true);
  });

  it("returns false for a wrong IP", () => {
    expect(isIp("0.0.0..168.0.1")).toEqual(false);
  });

  it("returns false for empty string", () => {
    expect(isIp("")).toEqual(false);
  });
});
