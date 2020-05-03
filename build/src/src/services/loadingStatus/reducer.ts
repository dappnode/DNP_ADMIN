import { merge } from "lodash";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Service > loadingStatus

export const dnpInstalledSlice = createSlice({
  name: "loadingStatus",
  initialState: {} as {
    [loadingId: string]: {
      isLoading: boolean;
      isLoaded: boolean;
      error?: string;
    };
  },
  reducers: {
    updateLoading: (
      state,
      action: PayloadAction<{ id: string; loading: boolean; error?: string }>
    ) =>
      merge(state, {
        [action.payload.id]: {
          isLoading: action.payload.loading,
          error: action.payload.error
        }
      }),

    updateIsLoading: (state, action: PayloadAction<{ id: string }>) =>
      merge(state, {
        [action.payload.id]: {
          isLoading: true
        }
      }),

    updateIsLoaded: (state, action: PayloadAction<{ id: string }>) =>
      merge(state, {
        [action.payload.id]: {
          isLoading: false,
          isLoaded: true
        }
      })
  }
});

export const reducer = dnpInstalledSlice.reducer;
