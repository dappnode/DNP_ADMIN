import { createAction } from "@reduxjs/toolkit";
import { ChainData } from "types";

// Service > chainData

export const requestChainData = createAction("chainData/request");

export const updateChainData = createAction<ChainData[]>("chainData/update");
