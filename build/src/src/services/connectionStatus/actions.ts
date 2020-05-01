import {
  CONNECTION_OPEN,
  CONNECTION_CLOSE,
  ConnectionOpen,
  ConnectionClose
} from "./types";

// Service > connectionStatus

export const connectionOpen = (): ConnectionOpen => ({
  type: CONNECTION_OPEN
});

export const connectionClose = ({
  error,
  isNotAdmin
}: {
  error: string;
  isNotAdmin: boolean;
}): ConnectionClose => ({
  type: CONNECTION_CLOSE,
  error,
  isNotAdmin
});
