import { keyBy } from "lodash";
import {
  AllReducerActions,
  UPDATE_DEVICE,
  UPDATE_DEVICES,
  DevicesState
} from "./types";

// Service > devices

export default function(
  state: DevicesState = {},
  action: AllReducerActions
): DevicesState {
  switch (action.type) {
    case UPDATE_DEVICES:
      return keyBy(action.devices, device => device.id);

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
}
