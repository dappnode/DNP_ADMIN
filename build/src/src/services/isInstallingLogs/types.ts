// Service > isInstallingLogs

export interface IsInstallingLogsState {
  logs: {
    [logId: string]: {
      [dnpName: string]: string; // Log: "Downloading 57%"
    };
  };
  dnpNameToLogId: {
    [dnpName: string]: string; // logId
  };
}

export const UPDATE_IS_INSTALLING_LOG = "UPDATE_IS_INSTALLING_LOG";
export const CLEAR_IS_INSTALLING_LOG = "CLEAR_IS_INSTALLING_LOG";

export interface UpdateIsInstallingLog {
  type: typeof UPDATE_IS_INSTALLING_LOG;
  id: string;
  dnpName: string;
  log: string;
}

export interface ClearIsInstallingLog {
  type: typeof CLEAR_IS_INSTALLING_LOG;
  id: string;
}

export type AllActionTypes = UpdateIsInstallingLog | ClearIsInstallingLog;
