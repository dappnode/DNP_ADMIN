//  INSTALLER
import * as t from "./actionTypes";
import merge from "deepmerge";
import { assertAction } from "utils/redux";
import Joi from "joi";

/**
 * @param userSetEnvs = {
 *   "kovan.dnp.dappnode.eth": {
 *     "ENV_NAME": "VALUE1"
 *   }, ... },
 * @param userSetPorts = {
 *   "kovan.dnp.dappnode.eth": {
 *     "30303": "31313:30303",
 *     "30303/udp": "31313:30303/udp"
 *   }, ... }
 * @param userSetVols = {
 *   "path:/root/.local": {
 *     host: "new_path"
 *     container: "/root/.local"
 *   }, ... },
 * }
 */
const initialState = {
  userSetEnvs: {},
  userSetPorts: {},
  userSetVols: {}
};

export default function(state = initialState, action) {
  const assertActionSchema = obj => assertAction(action, Joi.object(obj));
  switch (action.type) {
    // User set
    case t.UPDATE_USERSET_ENVS:
      assertActionSchema({
        dnpName: Joi.string().required(),
        id: Joi.string().required(),
        values: Joi.object().required()
      });
      return merge(state, {
        userSetEnvs: {
          [action.dnpName]: {
            [action.id]: action.values
          }
        }
      });

    case t.UPDATE_USERSET_PORTS:
      assertActionSchema({
        dnpName: Joi.string().required(),
        id: Joi.string().required(),
        values: Joi.object().required()
      });
      return merge(state, {
        userSetPorts: {
          [action.dnpName]: {
            [action.id]: action.values
          }
        }
      });

    case t.UPDATE_USERSET_VOLS:
      assertActionSchema({
        dnpName: Joi.string().required(),
        id: Joi.string().required(),
        values: Joi.object().required()
      });
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
