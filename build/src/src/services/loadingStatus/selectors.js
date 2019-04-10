import { mountPoint } from "./data";
import { createSelector } from "reselect";

// Service > loadingStatus

export const getLoadingStatuses = createSelector(
  state => state[mountPoint],
  loadingStatuses => loadingStatuses
);

/**
 * The `loadingId` variable is constant,
 * never changes on the lifetime of the components consuming it
 *
 * Returns true if the data has never been loaded and if is loading now
 * @param {String} loadingId
 * [Tested]
 */
export const getIsLoadingById = loadingId => {
  return createSelector(
    getLoadingStatuses,
    loadingStatuses =>
      Boolean(
        !(loadingStatuses[loadingId] || {}).isLoaded &&
          (loadingStatuses[loadingId] || {}).isLoading
      )
  );
};

/**
 * The `loadingId` variable is constant,
 * never changes on the lifetime of the components consuming it
 *
 * Returns true if the data has is loading now, EVEN if it has loaded in the past
 * @param {String} loadingId
 */
export const getIsLoadingStrictById = loadingId => {
  return createSelector(
    getLoadingStatuses,
    loadingStatuses => Boolean((loadingStatuses[loadingId] || {}).isLoading)
  );
};
