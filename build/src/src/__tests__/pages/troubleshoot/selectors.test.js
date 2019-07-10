import * as s from "../../../pages/support/selectors";

describe("pages > support > selectors", () => {
  describe("getIssueUrlRaw", () => {
    it("Should return the raw new issue url", () => {
      const state = {};
      expect(s.getIssueUrlRaw(state)).toEqual(
        "https://github.com/dappnode/DNP_ADMIN/issues/new"
      );
    });
  });
});
