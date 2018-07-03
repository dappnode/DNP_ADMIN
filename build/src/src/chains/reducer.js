// WATCHERS
import * as t from "./actionTypes";

const initialState = {
  chains: [],
  status: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.ADD_CHAIN:
      return {
        ...state,
        chains: [...state.chains, action.payload]
      };
    case t.REMOVE_CHAIN:
      return {
        ...state,
        chains: state.chains.filter(chain => chain.name !== action.payload.name)
      };
    case t.UPDATE_STATUS:
      return {
        ...state,
        status: {
          ...state.status,
          [action.id]: action.payload
        }
      };
    default:
      return state;
  }
}
