import { mountPoint } from "../../../services/chainData/data";
import reducer from "../../../services/chainData/reducer";
import * as a from "../../../services/chainData/actions";
import * as s from "../../../services/chainData/selectors";

describe("services > chainData, integral test of the redux components", () => {
  let state = {};

  it("Should set chainData and retrieve it", () => {
    const chainData = [
      { name: "kovan", message: "Synced" },
      { name: "geth", message: "Synced" }
    ];
    const expected = [
      { name: "kovan", message: "Synced" },
      { name: "geth", message: "Synced" }
    ];
    state = reducer(state, a.updateChainData(chainData));
    expect(s.getChainData({ [mountPoint]: state })).toEqual(expected);
  });
});
