import * as t from "./actionTypes";

// Service > devices

export default function(state = {}, action) {
  switch (action.type) {
    case t.UPDATE_DEVICES:
      return action.devices;

    case t.UPDATE_DEVICE:
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
