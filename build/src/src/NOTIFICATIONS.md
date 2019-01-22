# Notifications

## Removing guest users

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
