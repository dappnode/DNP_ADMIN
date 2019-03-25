//  PACKAGES
import t from "./actionTypes";

const initialState = {
  coreDeps: [],
  coreManifest: null,
  staticIp: null,
  staticIpInput: "",
  updatingCore: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_CORE_DEPS:
      return {
        ...state,
        coreDeps: action.coreDeps
      };
    case t.UPDATE_CORE_MANIFEST:
      return {
        ...state,
        coreManifest: action.coreManifest
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
    case t.UPDATE_UPDATING_CORE:
      return {
        ...state,
        updatingCore: action.updatingCore
      };
    default:
      return state;
  }
}
