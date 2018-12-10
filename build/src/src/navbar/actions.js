// NAVBAR
import * as t from "./actionTypes";

export const updateDappnodeIdentity = dappnodeIdentity => ({
  type: t.UPDATE_DAPPNODE_IDENTITY,
  dappnodeIdentity
});

export const viewedNotifications = () => ({
  type: t.VIEWED_NOTIFICATIONS
});

export const removeDappmanagerNotifications = () => ({
  type: t.REMOVE_DAPPMANAGER_NOTIFICATIONS
});
