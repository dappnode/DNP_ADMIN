import * as t from "./actionTypes";

// Service > dnpDirectory

export const updateDnpDirectory = dnps => ({
  type: t.UPDATE_DNP_DIRECTORY,
  dnps
});

export const updateDnpDirectoryById = (id, dnp) => ({
  type: t.UPDATE_DNP_DIRECTORY_BY_ID,
  id,
  dnp
});

export const fetchDnpDirectory = () => ({
  type: t.FETCH_DNP_DIRECTORY
});
