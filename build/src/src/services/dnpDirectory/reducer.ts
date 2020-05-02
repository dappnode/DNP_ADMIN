import { keyBy } from "lodash";
import { DnpDirectoryState } from "./types";
import { createReducer } from "@reduxjs/toolkit";
import { setDnpDirectory, updateStatus } from "./actions";

// Service > dnpDirectory

export const reducer = createReducer<DnpDirectoryState>(
  {
    directory: [],
    requestStatus: {}
  },
  builder => {
    builder.addCase(setDnpDirectory, (state, action) => {
      const directoryByName = keyBy(state.directory, dnp => dnp.name);
      return {
        ...state,
        directory: action.payload.map(dnp => {
          const currentDnp = directoryByName[dnp.name];
          return dnp.status === "loading" &&
            currentDnp &&
            currentDnp.status === "ok"
            ? currentDnp
            : dnp;
        })
      };
    });

    builder.addCase(updateStatus, (state, action) => {
      return {
        ...state,
        requestStatus: action.payload
      };
    });
  }
);
