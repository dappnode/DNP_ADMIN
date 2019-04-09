import * as t from "./actionTypes";
import { assertAction } from "utils/redux";
import { arrayToObj } from "utils/objects";

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
  switch (action.type) {
    case t.UPDATE_DEVICES:
      assertAction(action, { devices: [] });
      return arrayToObj(action.devices, "id");

    case t.UPDATE_DEVICE:
      assertAction(action, { id: "Mike", data: {} });
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
