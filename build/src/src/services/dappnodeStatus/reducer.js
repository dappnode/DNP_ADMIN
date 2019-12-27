import * as t from "./types";
import merge from "deepmerge";
import { arrayToObj } from "utils/objects";

// Service > dappnodeStatus

const initialState = {
  params: {},
  stats: {},
  diagnose: {},
  pingReturns: {},
  versionData: {},
  ipfsConnectionStatus: {},
  wifiStatus: {},
  passwordIsInsecure: false,
  autoUpdateData: {},
  identityAddress: null,
  mountpoints: null,
  volumes: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_DAPPNODE_PARAMS:
      // Replaces all params on each update
      return {
        ...state,
        params: action.params
      };

    case t.UPDATE_DAPPNODE_STATS:
      return merge(state, {
        stats: action.stats
      });

    case t.UPDATE_DAPPNODE_DIAGNOSE:
      return merge(state, {
        diagnose: arrayToObj(action.diagnose, "name")
      });

    case t.UPDATE_PING_RETURN:
      // pingReturn can be an Object, String or null
      return {
        ...state,
        pingReturns: {
          ...state.pingReturns,
          [action.dnp]: action.pingReturn
        }
      };

    case t.UPDATE_VERSION_DATA:
      return {
        ...state,
        versionData: {
          ...state.versionData,
          [action.dnp]: action.versionData
        }
      };

    case t.UPDATE_IPFS_CONNECTION_STATUS:
      return {
        ...state,
        ipfsConnectionStatus: action.ipfsConnectionStatus
      };

    case t.UPDATE_WIFI_STATUS:
      return {
        ...state,
        wifiStatus: action.wifiStatus
      };

    case t.UPDATE_PASSWORD_IS_INSECURE:
      return {
        ...state,
        passwordIsInsecure: action.passwordIsInsecure
      };

    case t.UPDATE_AUTO_UPDATE_DATA:
      return {
        ...state,
        autoUpdateData: action.autoUpdateData
      };

    case t.UPDATE_IDENTITY_ADDRESS:
      return {
        ...state,
        identityAddress: action.identityAddress
      };

    case t.UPDATE_MOUNTPOINTS:
      return {
        ...state,
        mountpoints: action.mountpoints
      };

    case t.UPDATE_VOLUMES:
      return {
        ...state,
        volumes: action.volumes
      };

    default:
      return state;
  }
}
