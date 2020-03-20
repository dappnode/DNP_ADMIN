import { EthClientTarget } from "../types";

export const route = "ethClientTargetSet.dappmanager.dnp.dappnode.eth";

/**
 * Changes the ethereum client used to fetch package data
 */

export interface RequestData {
  target: EthClientTarget;
  fallbackOn: boolean;
  deleteVolumes?: boolean;
}

export type ReturnData = void;

export const requestDataSchema = {
  type: "object",
  required: ["target"],
  properties: {
    target: { type: "string" },
    fallbackOn: { type: "boolean" },
    deleteVolumes: { type: "boolean" }
  }
};

// Samples for testing

export const requestDataSample: RequestData = {
  target: "geth-light",
  fallbackOn: true,
  deleteVolumes: true
};
