import { UserActionLog } from "common/types";

export * from "./common/types";

export interface UserActionLogWithCount extends UserActionLog {
  count?: number;
}
