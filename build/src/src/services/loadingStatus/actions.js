import * as t from "./actionTypes";

// Service > loadingStatus

export const updateLoading = (id, loading) => ({
  type: t.UPDATE_LOADING,
  id,
  loading
});

export const updateIsLoading = id => ({
  type: t.UPDATE_IS_LOADING,
  id
});

export const updateIsLoaded = id => ({
  type: t.UPDATE_IS_LOADED,
  id
});
