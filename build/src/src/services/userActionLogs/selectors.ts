import { mountPoint } from "./data";
import { UserActionLogWithCount } from "types";

// Service > userActionLogs

const getLocal = (state: any): UserActionLogWithCount[] => state[mountPoint];

export const getUserActionLogs = getLocal;
