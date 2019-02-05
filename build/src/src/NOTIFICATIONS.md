# Notifications

## Mainnet still syncing

If mainnet is syncing, show a notification saying: Until complete syncronization you will not be able to navigate to decentralized websites or install packages via .eth names

## Removing guest users

If guest user access is disabled alert that they may still have access

```js
toggleGuestUsers: disabling => {
    if (disabling) {
        dispatch({
            type: navbar.actionTypes.PUSH_NOTIFICATION,
            notification: {
            id: "guestUsersDisabling",
            type: "warning",
            title: "Guest users access",
            body:
                "Note that still connected guest users will have access until they disconnect. If you need to prevent them from using this DAppNode right now, go to the system tab and reset the VPN"
            }
        });
    }
    dispatch(action.toggleGuestUsers());
},
```

## Core update

If there is a core update, show a notification through the notifications system
