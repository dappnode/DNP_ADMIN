import * as t from "./actionTypes";
import { assertAction } from "utils/redux";

// Service > coreUpdate

const initialState = {
  coreDeps: {},
  coreManifest: null,
  updatingCore: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_CORE_DEPS:
      assertAction(action, { coreDeps: {} });
      return {
        ...state,
        coreDeps: action.coreDeps
      };

    case t.UPDATE_CORE_MANIFEST:
      assertAction(action, { coreManifest: {} });
      return {
        ...state,
        coreManifest: action.coreManifest
      };

    case t.UPDATE_UPDATING_CORE:
      assertAction(action, { updatingCore: true });
      return {
        ...state,
        updatingCore: action.updatingCore
      };

    default:
      return state;
  }
}
