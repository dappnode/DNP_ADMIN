//  PACKAGES
import * as t from "./actionTypes";

const initialState = {
  coreDeps: [],
  coreManifest: null
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

    default:
      return state;
  }
}
