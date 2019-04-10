//  PACKAGES
import t from "./actionTypes";
import merge from "deepmerge";

const initialState = {
  registries: {},
  repoName: {},
  query: {},
  queryResult: {},
  uiMessage: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_REGISTRY:
      return merge(state, {
        registries: {
          [action.registryEns]: action.data
        }
      });
    case t.UPDATE_REPO:
      return merge(state, {
        registries: {
          [action.registryEns]: {
            repos: {
              [action.repoName]: action.data
            }
          }
        }
      });
    case t.UPDATE_REPO_NAME:
      return merge(state, {
        repoName: {
          [action.repoName]: action.data
        }
      });
    case t.UPDATE_QUERY:
      return merge(state, {
        query: {
          [action.id]: action.value
        }
      });
    case t.UPDATE_QUERY_RESULT:
      return merge(state, {
        queryResult: {
          [action.id]: action.data
        }
      });
    case t.UPDATE_UI_MESSAGE:
      return merge(state, {
        uiMessage: {
          [action.uiId]: action.message
        }
      });
    default:
      return state;
  }
}
