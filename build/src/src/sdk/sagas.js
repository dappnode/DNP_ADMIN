import { call, put, all } from "redux-saga/effects";
import rootWatcher from "utils/rootWatcher";
import t from "./actionTypes";
import * as a from "./actions";

import getRegistry from "./sagaUtils/getRegistry";
import getRepo from "./sagaUtils/getRepo";
import resolveEns from "./sagaUtils/resolveEns";

// diagnoseEthchain();

// getRegistry("dnp.dappnode.eth");

/***************************** Subroutines ************************************/

function getRegistryFromRepo(repoName) {
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

async function generatePublishTx({
  ensName,
  manifestIpfsPath,
  version,
  developerAddress
}) {}

function* validateRepoName({ repoName }) {
  try {
    const { repoAddress, registryAddress } = yield call(
      resolveRepoName,
      repoName
    );
    yield put(a.updateRepoName(repoName, { repoAddress, registryAddress }));
  } catch (e) {
    console.error(`Error validating repoName "${repoName}": ${e.stack}`);
  }
}

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

function* onUpdateQuery({ id, value }) {
  try {
    if (id === "dnpName") {
      const { repoAddress, registryAddress } = yield call(
        resolveRepoName,
        value
      );
      yield put(
        a.updateQueryResult(id, { value, repoAddress, registryAddress })
      );
    }
    console.log(id, value);
  } catch (e) {
    console.error(`Error on update query for ${id} = ${value}: ${e.stack}`);
  }
}

/******************************* Watchers *************************************/

// Each saga is mapped with its actionType using takeEvery
// takeEvery(actionType, watchers[actionType])
const watchers = [
  [t.FETCH_REGISTRY, fetchRegistry],
  [t.VALIDATE_REPO_NAME, validateRepoName],
  [t.UPDATE_QUERY, onUpdateQuery, { throttle: 1000 }]
];

export default rootWatcher(watchers);
