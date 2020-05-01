import {
  AllActionTypes,
  DnpInstalledState,
  UPDATE_DNP_INSTALLED_STATUS,
  SET_DNP_INSTALLED,
  SET_DNP_INSTALLED_DATA,
  UPDATE_DNP_INSTALLED_DATA_STATUS
} from "./types";

// Service > dnpInstalled

const initialState: DnpInstalledState = {
  dnpInstalled: [],
  requestStatus: {},
  dnpInstalledData: {},
  dnpInstalledDataRequestStatus: {}
};

export default function(
  state: DnpInstalledState = initialState,
  action: AllActionTypes
): DnpInstalledState {
  switch (action.type) {
    case SET_DNP_INSTALLED:
      return {
        ...state,
        dnpInstalled: action.dnpInstalled
      };

    case SET_DNP_INSTALLED_DATA:
      return {
        ...state,
        dnpInstalledData: {
          ...state.dnpInstalledData,
          [action.id]: action.dnpInstalledData
        }
      };

    case UPDATE_DNP_INSTALLED_STATUS:
      return {
        ...state,
        requestStatus: action.requestStatus
      };

    case UPDATE_DNP_INSTALLED_DATA_STATUS:
      return {
        ...state,
        dnpInstalledDataRequestStatus: {
          ...state.dnpInstalledDataRequestStatus,
          [action.id]: action.requestStatus
        }
      };

    default:
      return state;
  }
}
