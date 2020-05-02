import { Reducer } from "redux";
import * as t from "./types";
import { DappnodeStatusState, AllReducerActions } from "./types";

// Service > dappnodeStatus

export const reducer: Reducer<DappnodeStatusState, AllReducerActions> = (
  state: DappnodeStatusState = {
    systemInfo: null,
    stats: {},
    diagnose: [],
    ipfsConnectionStatus: null,
    wifiStatus: null,
    passwordIsInsecure: false,
    autoUpdateData: null,
    mountpoints: [],
    volumes: []
  },
  action
) => {
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
      return {
        ...state,
        diagnose: action.diagnose
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
};
