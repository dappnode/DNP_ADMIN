import { RootState } from "rootReducer";
import { createSelector } from "reselect";
import { mapValues } from "lodash";
import * as loadingIds from "./loadingIds";

// Service > loadingStatus

export const getLoadingStatuses = (state: RootState) => state.loadingStatus;

/**
 * The `loadingId` variable is constant,
 * never changes on the lifetime of the components consuming it
 *
 * Returns true if the data has never been loaded and if is loading now
 * @param loadingId
 * [Tested]
 */
export const getIsLoadingById = (loadingId: string) => {
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
 * Returns true if the data has never been loaded and if is loading now
 * @param loadingId
 * [Tested]
 */
export const getLoadingErrorById = (loadingId: string) => {
  return createSelector(
    getLoadingStatuses,
    loadingStatuses => (loadingStatuses[loadingId] || {}).error || ""
  );
};

/**
 * The `loadingId` variable is constant,
 * never changes on the lifetime of the components consuming it
 *
 * Returns true if the data has is loading now, EVEN if it has loaded in the past
 * @param loadingId
 */
export const getIsLoadingStrictById = (loadingId: string) => {
  return createSelector(
    getLoadingStatuses,
    loadingStatuses => Boolean((loadingStatuses[loadingId] || {}).isLoading)
  );
};

export const getIsLoading = mapValues(loadingIds, id => getIsLoadingById(id));
export const getIsLoadingStrict = mapValues(loadingIds, id =>
  getIsLoadingStrictById(id)
);
export const getLoadingError = mapValues(loadingIds, id =>
  getLoadingErrorById(id)
);
