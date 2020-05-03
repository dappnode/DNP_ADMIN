# Admin UI

The administrative user interface allows users to control and monitor their DAppNode. It is a React SPA, divided into losly coupled modules, which represent the available routes and main navigation paths. Each module has the following folder structure, which includes basic redux building blocks.

## Admin UI <-> DAppNode communication

The `src/api` handles the communication with the DAppNode's WAMP. It uses the [`autobahn`](https://github.com/crossbario/autobahn-js) library to connect to the DAppNode's `crossbar` instance. Typically actions cause a change in the destination DNP state which emits its new state through `crossbar`'s pubsub, so multiple instances of the admin console observe the same state.

## General developer / style notes

- Do not use CSS prefixes. Create react app will add the necessary prefixes with the [CSS post-processor Autoprefixer](https://facebook.github.io/create-react-app/docs/post-processing-css)
