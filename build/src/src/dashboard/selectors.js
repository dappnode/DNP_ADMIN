// DASHBOARD
import { NAME } from "./constants";

// Selectors provide a way to query data from the module state.
// While they are not normally named as such in a Redux project, they
// are always present.

// The first argument of connect is a selector in that it selects
// values out of the state atom, and returns an object representing a
// component’s props.

// I would urge that common selectors by placed in the selectors.js
// file so they can not only be reused within the module, but
// potentially be used by other modules in the application.

// I highly recommend that you check out reselect as it provides a
// way to build composable selectors that are automatically memoized.

// From https://jaysoo.ca/2016/02/28/applying-code-organization-rules-to-concrete-redux-code/

// Utils

// #### EXTERNAL SELECTORS
export const session = state => state.session;
export const connectionOpen = state => session(state) && session(state).isOpen;
export const chainData = state => state.chainData;

// #### INTERNAL SELECTORS
export const local = state => state[NAME];
export const dappnodeStats = state => local(state).dappnodeStats;
