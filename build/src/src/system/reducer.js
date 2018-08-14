//  PACKAGES
import * as t from "./actionTypes";

const initialState = {
  packages: [],
  logs: {},
  systemUpdateAvailable: false,
  coreDeps: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_PACKAGES:
      return {
        ...state,
        packages: action.packages
      };
    case t.UPDATE_LOG:
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.id]: action.logs
        }
      };
    case t.SYSTEM_UPDATE_AVAILABLE:
      return {
        ...state,
        systemUpdateAvailable: action.systemUpdateAvailable
      };
    case t.CORE_DEPS:
      return {
        ...state,
        coreDeps: action.coreDeps
      };
    default:
      return state;
  }
}
