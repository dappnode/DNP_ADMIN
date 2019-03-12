# Notifications

Describe current notifications with this format:

- id: "uniqueIdToPreventDuplication",
- type: "success" (green) / "warning" (yellow) / "danger" (red),
- title: "Three word description",
- body: "Longer explanation of what is going on"

## Mainnet still syncing (Active)

If mainnet is syncing, show a notification saying: Until complete syncronization you will not be able to navigate to decentralized websites or install packages via .eth names

- id: "mainnetStillSyncing",
- type: "warning",
- title: "Mainnet still syncing",
- body: "Ethereum mainnet is still syncing. Until complete syncronization you will not be able to navigate to decentralized websites or install packages via .eth names"

## Removing guest users (Deprecated)

If guest user access is disabled alert that they may still have access

- id: "guestUsersDisabling",
- type: "warning",
- title: "Guest users access",
- body: "Note that still connected guest users will have access until they disconnect. If you need to prevent them from using this DAppNode right now, go to the system tab and reset the VPN"

## Core update (Active)

If there is a core update, show a notification through the notifications system

- id: "systemUpdateAvailable",
- type: "danger",
- title: "System update available",
- body: "DAppNode System Update Available. Go to the System tab to review and approve the update."
