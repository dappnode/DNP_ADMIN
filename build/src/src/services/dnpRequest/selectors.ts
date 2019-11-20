import { mountPoint } from "./data";
import { DnpRequestState } from "./types";
import { RequestedDnp, RequestStatus } from "types";

// Service > dnpRequest

const getLocal = (state: any): DnpRequestState => state[mountPoint];

export const getDnpRequest = (
  state: any,
  requestId: string
): RequestedDnp | undefined => getLocal(state).dnps[requestId];

export const getDnpRequestStatus = (
  state: any,
  requestId: string
): RequestStatus | undefined => getLocal(state).requestStatus[requestId];
