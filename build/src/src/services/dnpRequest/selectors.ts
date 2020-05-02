import { RootState } from "rootReducer";
import { RequestedDnp, RequestStatus } from "types";

// Service > dnpRequest

export const getDnpRequest = (
  state: RootState,
  requestId: string
): RequestedDnp | undefined => state.dnpRequest.dnps[requestId];

export const getDnpRequestStatus = (
  state: RootState,
  requestId: string
): RequestStatus | undefined => state.dnpRequest.requestStatus[requestId];
