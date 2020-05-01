import { UserActionLog, PackageVersionData } from "common/types";

export * from "./common/types";

export interface UserActionLogWithCount extends UserActionLog {
  count?: number;
}

// Window extension

declare global {
  interface Window {
    versionData?: PackageVersionData;
  }
}
