import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import Joi from "joi";

// Service > coreUpdate

/**
 * @param {object} coreUpdateData = {
 *   available: true {bool},
 *   type: "minor",
 *   packages: [
 *     {
 *       name: "core.dnp.dappnode.eth",
 *       from: "0.2.5",
 *       to: "0.2.6",
 *       manifest: {}
 *     },
 *     {
 *       name: "admin.dnp.dappnode.eth",
 *       from: "0.2.2",
 *       to: "0.2.3",
 *       manifest: {}
 *     }
 *   ],
 *   changelog: "Changelog text",
 *   updateAlerts: [{ message: "Specific update alert"}, ... ],
 *   versionId: "admin@0.2.6,core@0.2.8"
 * }
 */
const initialState = {
  coreUpdateData: {},
  updatingCore: false
};

export default function(state = initialState, action) {
  const assertActionSchema = obj => assertAction(action, Joi.object(obj));
  switch (action.type) {
    case t.UPDATE_CORE_UPDATE_DATA:
      assertActionSchema({
        coreUpdateData: Joi.object().required()
      });
      return {
        ...state,
        coreUpdateData: action.coreUpdateData
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
