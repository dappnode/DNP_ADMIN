import * as t from "./actionTypes";

// Service > dnpInstalled

export const updateDnpInstalled = dnps => ({
  type: t.UPDATE_DNP_INSTALLED,
  dnps
});
