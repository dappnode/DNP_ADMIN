import { mountPoint } from "services/dnpDirectory/data";
import reducer from "services/dnpDirectory/reducer";
import { DnpDirectoryState } from "services/dnpDirectory/types";
import { DirectoryItem } from "types";

// Redux imports

import { setDnpDirectory } from "services/dnpDirectory/actions";
import { getDnpDirectory } from "services/dnpDirectory/selectors";

/**
 * The purpose of this test is to ensure consistency of the
 * `whitelisted` mechanism, testing the reducer, actions and selector
 */

describe("services > dnpDirectory, whitelisted mechanism", () => {
  it("Should add a dnpDirectory, whitelist it and retrieve it", () => {
    let state: DnpDirectoryState = {
      requestStatus: {},
      directory: []
    };

    const sampleDirectoryItem: DirectoryItem = {
      status: "ok",
      name: "demo-name",
      description: "Demo description",
      avatarUrl: "",
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

    const action = setDnpDirectory(dnps);
    state = reducer(state, action);

    expect(getDnpDirectory({ [mountPoint]: state })).toEqual(dnps);
  });
});
