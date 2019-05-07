import * as s from "../../../pages/troubleshoot/selectors";

describe("pages > troubleshoot > selectors", () => {
  describe("getIssueUrlRaw", () => {
    it("Should return the raw new issue url", () => {
      const state = {};
      expect(s.getIssueUrlRaw(state)).toEqual(
        "https://github.com/dappnode/DNP_ADMIN/issues/new"
      );
    });
  });
});
