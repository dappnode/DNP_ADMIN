import * as t from "./actionTypes";
import merge from "deepmerge";
import * as schemas from "schemas";
import Joi from "joi";
// Utils
import { assertAction } from "utils/redux";
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
  autoUpdateSettings: {}
};

export default function(state = initialState, action) {
  const assertActionSchema = obj => assertAction(action, Joi.object(obj));
  switch (action.type) {
    case t.UPDATE_DAPPNODE_PARAMS:
      assertActionSchema({
        params: schemas.params.required()
      });
      // Replaces all params on each update
      return {
        ...state,
        params: action.params
      };

    case t.UPDATE_DAPPNODE_STATS:
      assertActionSchema({
        stats: schemas.stats.required()
      });
      return merge(state, {
        stats: action.stats
      });

    case t.UPDATE_DAPPNODE_DIAGNOSE:
      assertActionSchema({
        diagnose: Joi.array()
          .items(schemas.diagnose)
          .required()
      });
      return merge(state, {
        diagnose: arrayToObj(action.diagnose, "name")
      });

    case t.UPDATE_PING_RETURN:
      // pingReturn can be an Object, String or null
      assertActionSchema({
        dnp: Joi.string().required(),
        pingReturn: Joi.any()
      });
      return {
        ...state,
        pingReturns: {
          ...state.pingReturns,
          [action.dnp]: action.pingReturn
        }
      };

    case t.UPDATE_VERSION_DATA:
      assertActionSchema({
        dnp: Joi.string().required(),
        versionData: schemas.versionData.required()
      });
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

    case t.UPDATE_AUTO_UPDATE_SETTINGS:
      return {
        ...state,
        autoUpdateSettings: action.autoUpdateSettings
      };

    default:
      return state;
  }
}
