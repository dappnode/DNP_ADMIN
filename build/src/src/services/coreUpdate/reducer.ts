import {
  CoreUpdateState,
  AllActionTypes,
  UPDATE_CORE_UPDATE_DATA,
  UPDATE_UPDATING_CORE
} from "./types";

// Service > coreUpdate

const initialState: CoreUpdateState = {
  coreUpdateData: null,
  updatingCore: false
};

export default function(
  state = initialState,
  action: AllActionTypes
): CoreUpdateState {
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
}
