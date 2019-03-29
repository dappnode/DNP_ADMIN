import { mountPoint } from "../../../services/dnpDirectory/data";
import reducer from "../../../services/dnpDirectory/reducer";
import * as a from "../../../services/dnpDirectory/actions";
import * as s from "../../../services/dnpDirectory/selectors";

/**
 * The purpose of this test is to ensure consistency of the
 * `whitelisted` mechanism, testing the reducer, actions and selector
 */

describe("services > dnpDirectory, whitelisted mechanism", () => {
  let state = {};

  it("Should add a dnpDirectory, whitelist it and retrieve it", () => {
    const dnps = {
      dnpA: { name: "dnpA" },
      dnpB: { name: "dnpB" }
    };
    // Update the directory with this generic call that will whitelist the DNPs
    const action = a.updateDnpDirectory(dnps);
    state = reducer(state, action);
    // This second call is called when individual DNPs are fetched, they will not be whitelisted
    const action2 = a.updateDnpDirectoryById("dnpC", { name: "dnpC" });
    state = reducer(state, action2);
    expect(s.getDnpDirectoryWhitelisted({ [mountPoint]: state })).toEqual(dnps);
  });
});
