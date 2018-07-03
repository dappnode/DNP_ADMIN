// WATCHERS
import autobahn from "autobahn";
import * as t from "./actionTypes";
import * as selector from "./selectors";
import IPFS from "ipfs-mini";
import * as APIcalls from "API/crossbarCalls";
import modules from "./modules";

const Ethchain = modules.Ethchain;

const ipfs = new IPFS({
  host: "my.ipfs.dnp.dappnode.eth",
  port: 5001,
  protocol: "http"
});

const url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
const realm = "dappnode_admin";

let ethchains = [
  {
    id: "Kovan",
    name: "kovan.dnp.dappnode.eth",
    url: "ws://my.kovan.dnp.dappnode.eth:8546"
  },
  {
    id: "Ropsten",
    name: "ropsten.dnp.dappnode.eth",
    url: "ws://my.ropsten.dnp.dappnode.eth:8546"
  },
  {
    id: "Rinkeby",
    name: "rinkeby.dnp.dappnode.eth",
    url: "ws://my.rinkeby.dnp.dappnode.eth:8546"
  }
];

export const updateStatus = (id, status) => ({
  type: t.UPDATE_STATUS,
  payload: status,
  id
});

export const removeChain = chain => {
  chain.instance.stop();
  return {
    type: t.REMOVE_CHAIN,
    payload: chain
  };
};

const wrapUpdate = (id, dispatch) => res => {
  dispatch(updateStatus(id, res));
};

export const addChain = (chain, dispatch) => ({
  type: t.ADD_CHAIN,
  payload: {
    ...chain,
    instance: new Ethchain(chain.url, wrapUpdate(chain.id, dispatch))
  }
});

export const initMainnet = () => dispatch => {
  dispatch(
    addChain(
      {
        id: "Mainnet",
        name: "ethchain.dnp.dappnode.eth",
        url: "ws://my.ethchain.dnp.dappnode.eth:8546"
      },
      dispatch
    )
  );
};

export const init = () => (dispatch, getState) => {
  // Check which chains are ready
  APIcalls.listPackages().then(packages => {
    if (!packages) return;
    packages.forEach(pkg => {
      const chain = ethchains.find(chain => chain.name === pkg.name);
      if (!chain) return;
      const chains = selector.chains(getState());
      if (chains.find(_chain => _chain.name === pkg.name)) return;
      // Package form the list is whitelisted and not added to chains array
      console.log(chain, pkg);
      dispatch(addChain(chain, dispatch));
    });
  });
};

export const stopChainWatchers = () => (dispatch, getState) => {
  const chains = selector.chains(getState());
  for (const chain of chains) {
    dispatch(removeChain(chain));
  }
};

export const installedChain = name => (dispatch, getState) => {
  // Check which chains are ready
  const chain = ethchains.find(chain => chain.name === name);
  const chains = selector.chains(getState());
  if (chains.find(chain => chain.name === name)) return;
  // Package form the list is whitelisted and not added to chains array
  dispatch(addChain(chain, dispatch));
};

export const uninstalledChain = name => (dispatch, getState) => {
  if (!ethchains.find(chain => chain.name === name)) return;
  const chains = selector.chains(getState());
  const chain = chains.find(chain => chain.name === name);
  if (chain) {
    dispatch(removeChain(chain));
  }
};
