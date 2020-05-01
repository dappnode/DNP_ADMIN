import {
  UPDATE_LOADING,
  UPDATE_IS_LOADING,
  UPDATE_IS_LOADED,
  UpdateLoading,
  UpdateIsLoading,
  UpdateIsLoaded
} from "./types";

// Service > loadingStatus

export const updateLoading = (
  id: string,
  loading: boolean,
  error?: string
): UpdateLoading => ({
  type: UPDATE_LOADING,
  id,
  loading,
  error
});

export const updateIsLoading = (id: string): UpdateIsLoading => ({
  type: UPDATE_IS_LOADING,
  id
});

export const updateIsLoaded = (id: string): UpdateIsLoaded => ({
  type: UPDATE_IS_LOADED,
  id
});
