import { combineReducers, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CoreUpdateData } from "common/types";

// Service > coreUpdate

export const coreUpdateData = createSlice({
  name: "coreUpdateData",
  initialState: null as CoreUpdateData | null,
  reducers: {
    update: (state, action: PayloadAction<CoreUpdateData>) => action.payload
  }
});

export const updatingCore = createSlice({
  name: "updatingCore",
  initialState: false,
  reducers: {
    update: (state, action: PayloadAction<boolean>) => action.payload
  }
});

export const reducer = combineReducers({
  coreUpdateData: coreUpdateData.reducer,
  updatingCore: updatingCore.reducer
});
