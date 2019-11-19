import { CoreUpdateData } from "types";

export interface CoreUpdateState {
  coreUpdateData: CoreUpdateData | null;
  updatingCore: boolean;
}

export const UPDATE_CORE_UPDATE_DATA = "UPDATE_CORE_UPDATE_DATA";
export const UPDATE_UPDATING_CORE = "UPDATE_UPDATING_CORE";
export const UPDATE_CORE = "UPDATE_CORE";

export interface UpdateCoreUpdateData {
  type: typeof UPDATE_CORE_UPDATE_DATA;
  coreUpdateData: CoreUpdateData;
}

export interface UpdateUpdatingCore {
  type: typeof UPDATE_UPDATING_CORE;
  updatingCore: boolean;
}

export interface UpdateCore {
  type: typeof UPDATE_CORE;
}

export type AllActionTypes =
  | UpdateCoreUpdateData
  | UpdateUpdatingCore
  | UpdateCore;
