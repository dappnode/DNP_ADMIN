import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import * as schemas from "schemas";
import Joi from "joi";

// Service > coreUpdate

/**
 * @param {object} coreDeps = {
 *   "depName.dnp.dappnode.eth": <manifest object>
 * }
 */
const initialState = {
  coreDeps: {},
  coreManifest: null,
  updatingCore: false
};

export default function(state = initialState, action) {
  const assertActionSchema = obj => assertAction(action, Joi.object(obj));
  switch (action.type) {
    case t.UPDATE_CORE_DEPS:
      assertActionSchema({
        coreDeps: Joi.object({})
          .pattern(/.*/, Joi.object().required())
          .required()
      });
      return {
        ...state,
        coreDeps: action.coreDeps
      };

    case t.UPDATE_CORE_MANIFEST:
      assertActionSchema({
        coreManifest: schemas.manifest.required()
      });
      return {
        ...state,
        coreManifest: action.coreManifest
      };

    case t.UPDATE_UPDATING_CORE:
      assertActionSchema({
        updatingCore: Joi.boolean().required()
      });
      return {
        ...state,
        updatingCore: action.updatingCore
      };

    default:
      return state;
  }
}
