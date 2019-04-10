import * as t from "./actionTypes";

// Service > connectionStatus

export const connectionOpen = ({ session }) => ({
  type: t.CONNECTION_OPEN,
  session
});

export const connectionClose = ({ session, error, isNotAdmin }) => ({
  type: t.CONNECTION_CLOSE,
  session,
  error,
  isNotAdmin
});
