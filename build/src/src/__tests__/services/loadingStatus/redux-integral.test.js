import { mountPoint } from "../../../services/loadingStatus/data";
import reducer from "../../../services/loadingStatus/reducer";
import * as a from "../../../services/loadingStatus/actions";
import * as s from "../../../services/loadingStatus/selectors";

describe("services > loadingStatus, integral test of the redux components", () => {
  let state = {};
  const id = "devices";
  const getIsLoading = state => s.getIsLoadingById(id)({ [mountPoint]: state });

  it("Initial status should be: it's not loading", () => {
    expect(getIsLoading(state)).toEqual(false);
  });

  it("Should set an id to loadING status", () => {
    state = reducer(state, a.updateIsLoading(id));
    expect(getIsLoading(state)).toEqual(true);
  });

  it("Should set an id to loadED status", () => {
    state = reducer(state, a.updateIsLoaded(id));
    expect(getIsLoading(state)).toEqual(false);
  });

  it("Should set an id to loadING status, but since it's loaded, return false", () => {
    state = reducer(state, a.updateIsLoading(id));
    expect(getIsLoading(state)).toEqual(false);
  });
});
