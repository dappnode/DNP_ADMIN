import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import { arrayToObj } from "utils/objects";
import * as schemas from "schemas";
import Joi from "joi";

// Service > devices

/**
 * @param state = devices = {
 *   "MyPhone": {
 *     id: "MyPhone",
 *     isAdmin: false,
 *     url: "link-to-otp/?id=617824#hdfuisf" (optional),
 *     ip: 172.44.12.4 (optional)
 *   }, ... }
 * [Tested]
 */

export default function(state = {}, action) {
  const assertActionSchema = obj => assertAction(action, Joi.object(obj));
  switch (action.type) {
    case t.UPDATE_DEVICES:
      assertActionSchema({
        devices: schemas.devices.required()
      });
      return arrayToObj(action.devices, "id");

    case t.UPDATE_DEVICE:
      assertActionSchema({
        id: Joi.string().required(),
        data: Joi.object().required()
      });
      if (!state[action.id]) {
        console.error(`Attempting to update non-existant device ${action.id}`);
        return state;
      }
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.data
        }
      };

    default:
      return state;
  }
}
