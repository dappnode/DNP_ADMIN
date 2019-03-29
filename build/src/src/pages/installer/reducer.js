//  INSTALLER
import * as t from "./actionTypes";
import merge from "deepmerge";
import { assertAction } from "utils/redux";

const initialState = {
  selectedTypes: {},
  input: "",
  // userSetEnvs = {
  //   "kovan.dnp.dappnode.eth": {
  //     "ENV_NAME": "VALUE1"
  //  }, ... },
  userSetEnvs: {},
  // userSetPorts = {
  //   "kovan.dnp.dappnode.eth": {
  //     "30303": "31313:30303",
  //     "30303/udp": "31313:30303/udp"
  //  }, ... }
  userSetPorts: {},
  // userSetVols = "kovan.dnp.dappnode.eth": {
  //   "path:/root/.local": {
  //     host: "new_path"
  //     container: "/root/.local"
  //  }, ... },
  userSetVols: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_SELECTED_TYPES:
      assertAction(action, { payload: {} });
      return merge(state, {
        selectedTypes: action.payload
      });

    case t.UPDATE_INPUT:
      assertAction(action, { payload: "dnp" });
      return merge(state, {
        input: action.payload
      });

    // User set
    case t.UPDATE_USERSET_ENVS:
      assertAction(action, { dnpName: "dnp", key: "FOO", value: "BAR" });
      return merge(state, {
        userSetEnvs: {
          [action.dnpName]: {
            [action.key]: action.value
          }
        }
      });

    case t.UPDATE_USERSET_PORTS:
      assertAction(action, { dnpName: "dnp", id: "30303", values: {} });
      return merge(state, {
        userSetPorts: {
          [action.dnpName]: {
            [action.id]: action.values
          }
        }
      });

    case t.UPDATE_USERSET_VOLS:
      assertAction(action, { dnpName: "dnp", id: "dnp_data", values: {} });
      return merge(state, {
        userSetVols: {
          [action.dnpName]: {
            [action.id]: action.values
          }
        }
      });

    case t.CLEAR_USERSET:
      return {
        ...state,
        userSetEnvs: {},
        userSetPorts: {},
        userSetVols: {}
      };

    // #### Default case
    default:
      return state;
  }
}
