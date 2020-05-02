import { createAction } from "@reduxjs/toolkit";
import { coreUpdateData, updatingCore } from "./reducer";

// Service > coreUpdate

export const updateCoreUpdateData = coreUpdateData.actions.update;
export const updateUpdatingCore = updatingCore.actions.update;
export const updateCore = createAction("coreUpdate/doCoreUpdate");
