//  PACKAGES
import * as t from "./actionTypes";

const initialState = {
  issueUrl: "https://github.com/dappnode/DNP_ADMIN/issues/new"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_ISSUE_URL:
      return {
        ...state,
        issueUrl: action.issueUrl
      };
    default:
      return state;
  }
}
