// DEVICES
import t from "./actionTypes";
import { getDeviceId } from "./utils"
import merge from "deepmerge";

const initialState = {
  fetching: false,
  devices: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    // External action type. Used in API subscriptions
    case "UPDATE_DEVICES":
      // Convert the devices array to an object, merging each device object individually
      // This allows devices to be removed, if the new array does not contain them
      return {
        ...state,
        devices: action.devices.reduce((obj, d) => {
          const id = getDeviceId(d)
          if (!id) console.warn('Calling UPDATE_DEVICES reducer without a device id')
          return { ...obj, [id]: merge(state.devices[id] || {}, d) }
        }, {})
      }
    case t.UPDATE_DEVICE:
      if (!action.id) console.warn('Calling UPDATE_DEVICE reducer without a device id')
      if (!state.devices[action.id]) return state
      return merge(state, {
        devices: {
          [action.id]: action.data
        }
      });
    case t.UPDATE_FETCHING:
      return {
        ...state,
        fetching: action.fetching
      };
    default:
      return state;
  }
}
