# Installer module

Performs and handles new DNP installations. DNPs can be installed using their ENS domain or the IPFS hash of their manifest. Lists available DNPs for installation which have been preselected by the DAppNode team and listed in a directory smart contract. The admin can install unlisted DNPs using the provided search bar. Communicates with the DNP_DAPPMANAGER through WAMP.

## Data fetches

- On module initialization it will fetch all packages in the DAppNode directory (only getting the lastest version). The call `APIcall.fetchDirectory` will be fired which makes the DAPPMANAGER progressively emit package info, which is picked up in API/socketSubscriptions.js and stored in the directory state variable.

- When the user types a valid query in the input field, it will be fetched, and stored in the directory.

- When the user enters the ADMIN UI from /installer/packageName that id is picked from the url and resolved if possible

- When the user opens a package, a resolveRequest will be fetched to check if the package is compatible.

## ProgressLog

To provide feedback during the installation of packages the DAPPMANAGER emits `"log.dappmanager.dnp.dappnode.eth"`, which is picked up by API/socketSubscriptions.js and dispatches:

```javascript
{
    type: "installer/PROGRESS_LOG",
    logId: log.logId,
    msg: log.msg,
    pkgName: log.pkg
}
```

The progressLog messages are stored in the store as:

```javascript
// state.installer
progressLogs: {
    [action.logId]: {
        [action.pkgName]: action.msg
    }
}
```

Then when the installation associated to that logId is completed, it is removed from the progressLog variable.

```javascript
delete progressLogs[action.logId];
```

When an install package view is openned it checks if there is an on-going installation including that package. If so, it displays its progress. The package name in the progressLog is always its ENS domain even if it's an IPFS package.
