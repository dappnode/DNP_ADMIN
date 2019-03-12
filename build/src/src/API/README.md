# WAMP: ADMIN <-> DAppNode communications

Handles the communication with the DAppNode's WAMP. It uses the `autobahn` library to connect to the DAppNode's `crossbar` instance.

User action trigger a RPC, which are defined in `src/API/rpcMethods`. Typically actions cause a change in the destination DNP state which emits its new state through `crossbar`'s pubsub, so multiple instances of the admin console observe the same state.

The Admin UI only communicates with two core DNPs. You can find the list of available RPCs and their documentation at:

- DNP_DAPPMANAGER, [RPCs documentation](https://github.com/dappnode/DNP_DAPPMANAGER/tree/master/build/src/src/calls)
- DNP_VPN, [RPCs documentation](https://github.com/dappnode/DNP_VPN/tree/master/build/src/src/calls)
