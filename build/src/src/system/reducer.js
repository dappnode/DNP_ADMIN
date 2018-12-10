//  PACKAGES
import t from "./actionTypes";
import merge from "deepmerge";

const initialState = {
  fetching: false,
  logs: {},
  systemUpdateAvailable: false,
  coreDeps: [],
  staticIp: null,
  staticIpInput: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_LOG:
      return merge(state, {
        logs: {
          [action.id]: action.logs
        }
      });
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
    case t.UPDATE_FETCHING:
      return {
        ...state,
        fetching: action.fetching
      };
    case t.UPDATE_STATIC_IP:
      return {
        ...state,
        staticIp: action.staticIp
      };
    case t.UPDATE_STATIC_IP_INPUT:
      return {
        ...state,
        staticIpInput: action.staticIpInput
      };
    default:
      return state;
  }
}
