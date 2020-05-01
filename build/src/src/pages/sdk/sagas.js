import { call, put, all, select, take, delay } from "redux-saga/effects";
import { rootWatcher } from "utils/redux";
import t from "./actionTypes";
import * as a from "./actions";
import * as s from "./selectors";

import getRegistry from "./sagaUtils/getRegistry";
import getRepo from "./sagaUtils/getRepo";
import resolveEns from "./sagaUtils/resolveEns";
import apm from "./sagaUtils/apm";
import connectToMetamask from "./sagaUtils/connectToMetamask";
import executePublishTx from "./sagaUtils/executePublishTx";
import { api } from "api";
import { assertConnectionOpen } from "utils/redux";

// getRegistry("dnp.dappnode.eth");

/***************************** Subroutines ************************************/

function* connectMetamask() {
  try {
    yield put(a.updateGenericError(null));
    /* eslint-disable-next-line no-console */
    console.log("Connecting to metamask...");
    const web3 = yield call(connectToMetamask);
    const networkId = yield call(web3.eth.net.getId);
    const accounts = yield call(web3.eth.getAccounts);
    const userAddress = accounts[0];
    yield put(
      a.updateQueryResult("metamaskInfo", {
        userAddress,
        networkId,
        connected: true
      })
    );
    yield put(a.updateQuery("userAccount", userAddress));
    while (true) {
      try {
        yield take(t.PUBLISH);
        const query = yield select(s.getQuery);
        const repoInfo = yield select(s.getQueryResultRepoInfo);
        const txHash = yield call(executePublishTx, web3, {
          ...query,
          ...repoInfo
        });
        a.updateQueryResult("call", {
          type: "success",
          message: `Tx successfully executed. Tx hash: ${txHash}`
        });
      } catch (e) {
        console.error(`Error executing transaction: ${e.stack}`);
        yield put(
          a.updateQueryResult("call", {
            type: "error",
            message: `Error executing transaction: ${e.message}`
          })
        );
      }
      yield call(delay, 500);
    }
  } catch (e) {
    console.error("Error connecting to metamask: ", e.stack);
    yield put(
      a.updateGenericError(`Error connecting to metamask: ${e.message}`)
    );
  }
}

function getRegistryFromRepo(repoName = "") {
  return repoName
    .split(".")
    .slice(1)
    .join(".");
}

// Check if the registry and repo exist
async function resolveRepoName(repoName) {
  const registryName = getRegistryFromRepo(repoName);
  const [repoAddress, registryAddress] = await Promise.all(
    [repoName, registryName].map(resolveEns)
  );
  return { repoAddress, registryAddress };
}

// async function generatePublishTx({
//   ensName,
//   manifestIpfsPath,
//   version,
//   developerAddress
// }) {}

function* fetchRegistry({ registryEns }) {
  try {
    if (!registryEns) throw Error("registryEns must be defined");
    yield put(
      a.updateRegistry(registryEns, { name: registryEns, fetching: true })
    );
    const registryAddress = yield call(resolveEns, registryEns);
    yield put(a.updateRegistry(registryEns, { address: registryAddress }));
    const repos = yield call(getRegistry, registryAddress);
    yield put(a.updateRegistry(registryEns, { repos, fetching: false }));
    yield all(
      Object.values(repos).map(repo =>
        call(function*() {
          yield put(a.updateRepo(registryEns, repo.name, { fetching: true }));
          const repoData = yield call(getRepo, repo);
          yield put(
            a.updateRepo(registryEns, repo.name, {
              ...repoData,
              fetching: false
            })
          );
        })
      )
    );
  } catch (e) {
    console.error(`Error fetching registry "${registryEns}": ${e.stack}`);
  }
}

const inputHanlders = {
  dnpName: function* onUpdateQueryDnpName({ id, value }) {
    try {
      const { repoAddress, registryAddress } = yield call(
        resolveRepoName,
        value
      );
      yield put(
        a.updateQueryResult("repoInfo", { value, repoAddress, registryAddress })
      );
      if (repoAddress) {
        const latestVersion = yield call(apm.getLatestVersion, repoAddress);
        yield put(a.updateQueryResult("repoInfo", { latestVersion }));
      } else if (registryAddress) {
        yield put(a.updateQueryResult("repoInfo", { latestVersion: "0.0.0" }));
      }
      const userAddress = (window.ethereum || {}).selectedAddress;
      if (repoAddress && userAddress) {
        const isAllowed = yield call(apm.isAllowed, repoAddress, userAddress);
        yield put(
          a.updateQueryResult("allowedAddress", {
            userAddress,
            repoAddress,
            isAllowed
          })
        );
      }
    } catch (e) {
      console.error(`Error on update query for ${id} = ${value}: ${e.stack}`);
    }
  },
  userAddress: function* onUpdateQueryUserAddress({ id, value }) {
    try {
      const repoInfo = yield select(s.getQueryResultRepoInfo);
      const repoAddress = (repoInfo || {}).repoAddress;
      const userAddress = value;
      if (repoAddress && userAddress) {
        const isAllowed = yield call(apm.isAllowed, repoAddress, userAddress);
        yield put(
          a.updateQueryResult("allowedAddress", {
            userAddress,
            repoAddress,
            isAllowed
          })
        );
      }
    } catch (e) {
      console.error(`Error on update query for ${id} = ${value}: ${e.stack}`);
    }
  },
  manifestIpfsHash: function* onUpdateQueryManifestIpfsHash({ id, value }) {
    try {
      yield call(assertConnectionOpen);
      const res = yield call(api.fetchPackageData, { id: value });
      if (res.success && res.result && res.result.manifest) {
        const manifest = (res.result || {}).manifest;
        yield put(a.updateQueryResult("manifest", { hash: value, manifest }));
      } else {
        throw Error(
          `Error fetching manifest for publish form verification: ${res.message}`
        );
      }
    } catch (e) {
      console.error(`Error on update query for ${id} = ${value}: ${e.stack}`);
    }
  }
};

const getId = id => `${t.UPDATE_QUERY}_${id}`;
function* onUpdateQuery({ id, value }) {
  try {
    yield put({ type: getId(id), id, value });
  } catch (e) {
    console.error(`Error on update query for ${id} = ${value}: ${e.stack}`);
  }
}

// Update query dedicated throttling PER ID

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [t.FETCH_REGISTRY, fetchRegistry],
  [t.UPDATE_QUERY, onUpdateQuery],
  ...Object.keys(inputHanlders).map(id => [getId(id), inputHanlders[id]]),
  [t.CONNECT_METAMASK, connectMetamask]
];

export default rootWatcher(watchers);
