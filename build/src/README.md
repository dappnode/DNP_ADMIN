# Admin UI

The administrative user interface allows users to control and monitor their DAppNode. It is a React SPA, divided into losly coupled modules, which represent the available routes and main navigation paths. Each module has the following folder structure, which includes basic redux building blocks:

- **components**: JSX components of the module. In the module's `index.js` the entrypoint or main component is exported as `component`. It is the component mounted in `App.js`.
- **actions**: See [redux actions](https://redux.js.org/basics/actions)
- **actionTypes**: Exports references to each action type string to minimize typo errors. See [redux action types](https://redux-resource.js.org/api-reference/action-types)
- **reducer**: Exports a single reducer which is imported in [`src/rootReducer`](./src/rootReducer) and combined with other reducers. See [redux reducers](https://redux.js.org/basics/reducers)
- **selectors**: See [redux selectors](https://redux.js.org/recipes/computing-derived-data)
- **sagas**: Export a single generator function which is imported in [`src/rootSaga.js`](./src/rootSaga.js) and executed in paralel with all modules. See [redux-saga](https://redux-saga.js.org/) for further reference.
- **constants**: Contains the name of the module and other invariants. Used to label the module in module aggreators.

## Modules

- [**Dashboard**](./src/dashboard): Summarizes the status of the DAppNode. It shows the syncing status of running chains, a summary of multiple sanity checks, the host machine cpu memory and disk usage, and some relevant volume sizes. Its purpose it to quickly asses the current status of your DAppNode.
- [**Activity**](./src/activity): Lists all actions performed by the user, the action id, arguments, and result. Its purpose is to assist in debugging, as it shows the error stack of unsuccessful calls.
- [**Devices**](./src/devices): Manages VPN devices access and permisions. Allows the admin to generate new credentials, give or revoke admin priviledges to devices and remove current devices. Communicates with the DNP_VPN through WAMP.
- [**Installer**](./src/installer): Performs and handles new DNP installations. DNPs can be installed using their ENS domain or the IPFS hash of their manifest. Lists available DNPs for installation which have been preselected by the DAppNode team and listed in a directory smart contract. The admin can install unlisted DNPs using the provided search bar. Communicates with the DNP_DAPPMANAGER through WAMP.
- [**Packages**](./src/packages): Manages installed DNPs. It shows detailed information about each DNP, running state, volume size, port mappings, etc. It offers controls to modify its enviromental variables (envs), stream its logs, reset its volumes or remove the DNP.
- [**System**](./src/system): Manages system features and core DNPs. It allows the admin to enable and disable the DAppNode's static IP, to prevent it from using the dyndns service. I also allows the same features and controls as the Packages module. However, system DNPs can't be remove or stopped as that would break the DAppNode.
- [**Sdk**](./src/sdk): Interacts with the a DNP's Aragon Package Manager (APM) smart contract. I assists the DAppNodeSDK CLI and is not intended to be used independently.
- [**Troubleshoot**](./src/troubleshoot): Auto-support tool to help identify error causes. Provides generic solutions to common problems after performing a list of routine checks. It also prepopulates a github issue with that DAppNode's particular system info to aid in the support proccess. All info is shown to the admin beforehand and is not sent anywhere without the explicit action of the admin.

## Admin UI <-> DAppNode communication

The [`src/API` directory](./src/API) handles the communication with the DAppNode's WAMP. It uses the [`autobahn`](https://github.com/crossbario/autobahn-js) library to connect to the DAppNode's `crossbar` instance.

User action trigger a RPC, which are defined in [`src/API/rpcMethods`](./src/API/rpcMethods). Typically actions cause a change in the destination DNP state which emits its new state through `crossbar`'s pubsub, so multiple instances of the admin console observe the same state.
