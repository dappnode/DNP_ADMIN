# Admin UI

The administrative user interface allows users to control and monitor their DAppNode. It is a React SPA, divided into losly coupled modules, which represent the available routes and main navigation paths. Each module has the following folder structure, which includes basic redux building blocks:

- **components**: JSX components of the module. In the module's `index.js` the entrypoint or main component is exported as `component`. It is the component mounted in `App.js`.
- **actions**: See [redux actions](https://redux.js.org/basics/actions)
- **actionTypes**: Exports references to each action type string to minimize typo errors. See [redux action types](https://redux-resource.js.org/api-reference/action-types)
- **reducer**: Exports a single reducer which is imported in [`src/rootReducer`](./src/rootReducer) and combined with other reducers. See [redux reducers](https://redux.js.org/basics/reducers)
- **selectors**: See [redux selectors](https://redux.js.org/recipes/computing-derived-data)
- **sagas**: Export a single generator function which is imported in [`src/rootSaga.js`](./src/rootSaga.js) and executed in paralel with all modules. See [redux-saga](https://redux-saga.js.org/) for further reference.
- **constants**: Contains the name of the module and other invariants. Used to label the module in module aggreators.

## Admin UI <-> DAppNode communication

The `src/api` handles the communication with the DAppNode's WAMP. It uses the [`autobahn`](https://github.com/crossbario/autobahn-js) library to connect to the DAppNode's `crossbar` instance. Typically actions cause a change in the destination DNP state which emits its new state through `crossbar`'s pubsub, so multiple instances of the admin console observe the same state.

## General developer / style notes

- Do not use CSS prefixes. Create react app will add the necessary prefixes with the [CSS post-processor Autoprefixer](https://facebook.github.io/create-react-app/docs/post-processing-css)
