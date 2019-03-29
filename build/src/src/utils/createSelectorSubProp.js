import { createSelector } from "reselect";

const createSelectorSubProp = (selector, key) =>
  createSelector(
    selector,
    res => res[key]
  );

export default createSelectorSubProp;
