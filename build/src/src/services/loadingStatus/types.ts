// Service > loadingStatus

export interface LoadingStatusState {
  [loadingId: string]: {
    isLoading: boolean;
    isLoaded: boolean;
    error?: string;
  };
}

export const UPDATE_LOADING = "UPDATE_LOADING";
export const UPDATE_IS_LOADING = "UPDATE_IS_LOADING";
export const UPDATE_IS_LOADED = "UPDATE_IS_LOADED";

export interface UpdateLoading {
  type: typeof UPDATE_LOADING;
  id: string;
  loading: boolean;
  error?: string;
}

export interface UpdateIsLoading {
  type: typeof UPDATE_IS_LOADING;
  id: string;
}

export interface UpdateIsLoaded {
  type: typeof UPDATE_IS_LOADED;
  id: string;
}

export type AllReducerActions =
  | UpdateLoading
  | UpdateIsLoading
  | UpdateIsLoaded;
