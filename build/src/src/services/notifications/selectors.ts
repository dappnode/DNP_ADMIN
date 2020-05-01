import { mountPoint } from "./data";
import { NotificationsState } from "./types";

// Service > notifications

const getLocal = (state: any): NotificationsState => state[mountPoint];

export const getNotifications = (state: any) => Object.values(getLocal(state));
