//  PACKAGES
import * as t from "./actionTypes";
import merge from "deepmerge";

const initialState = {
  logs: {},
  systemUpdateAvailable: false,
  coreDeps: []
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
      return merge(state, {
        systemUpdateAvailable: action.systemUpdateAvailable
      });
    case t.CORE_DEPS:
      return merge(state, {
        coreDeps: action.coreDeps
      });
    default:
      return state;
  }
}
