// Service > connectionStatus

/**
 * ```js
 * {
 *   isOpen: false,
 *   error: "Unreachable",
 *   isNotAdmin: false
 * }
 * ```
 */
export interface ConnectionStatusState {
  isOpen: boolean;
  isNotAdmin: boolean;
  error: string | null;
}

export const CONNECTION_OPEN = "CONNECTION_OPEN";
export const CONNECTION_CLOSE = "CONNECTION_CLOSE";

export interface ConnectionOpen {
  type: typeof CONNECTION_OPEN;
}

export interface ConnectionClose {
  type: typeof CONNECTION_CLOSE;
  error: string;
  isNotAdmin: boolean;
}

export type AllReducerActions = ConnectionOpen | ConnectionClose;
