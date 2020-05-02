import { Reducer } from "redux";
import {
  AllReducerActions,
  UPDATE_DEVICE,
  UPDATE_DEVICES,
  DevicesState
} from "./types";
import { VpnDevice } from "common/types";

// Service > devices

export const reducer: Reducer<DevicesState, AllReducerActions> = (
  state = {},
  action
) => {
  switch (action.type) {
    case UPDATE_DEVICES:
      return action.devices.reduce(
        (obj: { [id: string]: VpnDevice }, device) => {
          return { ...obj, [device.id]: device };
        },
        {}
      );

    case UPDATE_DEVICE:
      if (!state[action.id]) {
        console.error(`Attempting to update non-existant device ${action.id}`);
        return state;
      }
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.device
        }
      };

    default:
      return state;
  }
};
