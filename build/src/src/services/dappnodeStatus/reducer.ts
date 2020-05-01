import * as t from "./types";
import { DappnodeStatusState } from "./types";
import merge from "deepmerge";
import { arrayToObj } from "utils/objects";

// Service > dappnodeStatus

const initialState: DappnodeStatusState = {
  systemInfo: null,
  stats: {},
  diagnose: [],
  ipfsConnectionStatus: {},
  wifiStatus: {},
  passwordIsInsecure: false,
  autoUpdateData: null,
  mountpoints: [],
  volumes: []
};

export default function(state = initialState, action: any) {
  switch (action.type) {
    case t.SET_SYSTEM_INFO:
      return {
        ...state,
        systemInfo: action.systemInfo
      };

    case t.UPDATE_DAPPNODE_STATS:
      return {
        ...state,
        stats: action.stats
      };

    case t.UPDATE_DAPPNODE_DIAGNOSE:
      return merge(state, {
        diagnose: arrayToObj(action.diagnose, "name")
      });

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
