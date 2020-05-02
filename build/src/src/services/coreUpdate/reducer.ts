import { Reducer } from "redux";
import {
  CoreUpdateState,
  AllActionTypes,
  UPDATE_CORE_UPDATE_DATA,
  UPDATE_UPDATING_CORE
} from "./types";

// Service > coreUpdate

export const reducer: Reducer<CoreUpdateState, AllActionTypes> = (
  state = {
    coreUpdateData: null,
    updatingCore: false
  },
  action
) => {
  switch (action.type) {
    case UPDATE_CORE_UPDATE_DATA:
      return {
        ...state,
        coreUpdateData: action.coreUpdateData
      };

    case UPDATE_UPDATING_CORE:
      return {
        ...state,
        updatingCore: action.updatingCore
      };

    default:
      return state;
  }
};
