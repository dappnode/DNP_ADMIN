import { mountPoint } from "services/dnpDirectory/data";
import reducer from "services/dnpDirectory/reducer";
import * as a from "services/dnpDirectory/actions";
import * as s from "services/dnpDirectory/selectors";
import { DnpDirectoryState } from "services/dnpDirectory/types";
import { DirectoryItem } from "types";

/**
 * The purpose of this test is to ensure consistency of the
 * `whitelisted` mechanism, testing the reducer, actions and selector
 */

describe("services > dnpDirectory, whitelisted mechanism", () => {
  it("Should add a dnpDirectory, whitelist it and retrieve it", () => {
    let state: DnpDirectoryState = [];

    const sampleDirectoryItem: DirectoryItem = {
      name: "demo-name",
      description: "Demo description",
      avatar: "",
      isInstalled: false,
      isUpdated: false,
      whitelisted: true,
      isFeatured: false,
      categories: ["Blockchain"]
    };

    const dnps: DirectoryItem[] = [
      { ...sampleDirectoryItem, name: "dnpA" },
      { ...sampleDirectoryItem, name: "dnpB" }
    ];

    const action = a.updateDnpDirectory(dnps);
    state = reducer(state, action);

    expect(s.getDnpDirectory({ [mountPoint]: state })).toEqual(dnps);
  });
});
