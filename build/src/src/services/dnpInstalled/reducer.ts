import {
  AllActionTypes,
  DnpInstalledState,
  UPDATE_DNP_INSTALLED_STATUS,
  SET_DNP_INSTALLED
} from "./types";

// Service > dnpInstalled

const initialState: DnpInstalledState = {
  dnpInstalled: [],
  requestStatus: {}
};

export default function(
  state = initialState,
  action: AllActionTypes
): DnpInstalledState {
  switch (action.type) {
    case SET_DNP_INSTALLED:
      return {
        ...state,
        dnpInstalled: action.dnpInstalled
      };

    case UPDATE_DNP_INSTALLED_STATUS:
      return {
        ...state,
        requestStatus: action.requestStatus
      };

    default:
      return state;
  }
}
