// SDK
import { mountPoint } from "./data";
import semver from "semver";
import web3Utils from "web3-utils";
import isIpfsHash from "utils/isIpfsHash";
import { stringIncludes } from "utils/strings";
import generatePublishTx from "./sagaUtils/generatePublishTx";

// #### EXTERNAL

// #### INTERNAL

const local = state => state[mountPoint];
export const registries = state => local(state).registries;
export const repoName = state => local(state).repoName;
export const query = state => local(state).query;
export const queryResult = state => local(state).queryResult;
export const getQuery = state => local(state).query;
export const getQueryResult = state => local(state).queryResult;

export const getGenericError = state =>
  (getQueryResult(state) || {})["genericError"];

export const getShowManifestButtons = state => {
  const manifestHashInput = getManifestHashInput(state);
  const manifestIpfsHash = getQuery(state).manifestIpfsHash;
  return !manifestHashInput.error && manifestHashInput.success
    ? manifestIpfsHash
    : null;
};

export const getDisablePublish = state => {
  const someFormInputIsInvalid = getInputFields(state)
    .filter(({ hide }) => !hide)
    .reduce(
      (disable, field) => disable || field.error || !field.success,
      false
    );
  const { addressNotAllowed } = getButtonInput(state) || {};
  return someFormInputIsInvalid || addressNotAllowed;
};

export const getInputFields = state => [
  {
    id: "dnpName",
    name: "DAppNode Package name",
    placeholder: "full ENS name",
    help:
      "Full ENS name of the DAppNode Package to update, i.e. timeapp.public.dappnode.eth",
    ...getDnpNameInput(state)
  },
  {
    id: "developerAddress",
    name: "Developer address",
    placeholder: "Ethereum address",
    help:
      "Ethereum address of the developer address that will control this repo",
    ...getDeveloperAddressInput(state)
  },
  {
    id: "version",
    name: "Next version",
    placeholder: "Semantic version",
    help: "Semantic version about to be published, i.e. 0.1.7",
    ...getVersionInput(state)
  },
  {
    id: "manifestIpfsHash",
    name: "Manifest hash",
    placeholder: "IPFS multihash",
    help:
      "Multihash content address of the manifest. Must be in the format /ipfs/[multihash], i.e. /ipfs/QmVeaz5kR55nAiGjYpXpUAJpWvf6net4MbGFNjBfMTS8xS",
    ...getManifestHashInput(state)
  }
];

// Errors + success rules

export const getQueryResultRepoInfo = state => {
  const dnpName = getQuery(state).dnpName;
  const repoInfo = getQueryResult(state).repoInfo;
  // If the dnpName store in the query result is not the same as the query,
  // it means it's still loading
  if (!(repoInfo || {}).value || repoInfo.value !== dnpName) return null;
  else return repoInfo;
};

export const getQueryResultMetamaskInfo = state =>
  getQueryResult(state).metamaskInfo;
export const getQueryResultAllowedAddress = state =>
  getQueryResult(state).allowedAddress;
export const getQueryResultCall = state => getQueryResult(state).call;
export const getQueryResultManifest = state => getQueryResult(state).manifest;

// ========
// DNP NAME
// ========

function getDnpNameInput(state) {
  const dnpName = getQuery(state).dnpName;
  const repoInfo = getQueryResultRepoInfo(state);
  const error = [],
    success = [];
  // Validation that don't require external calls
  if (dnpName && !stringIncludes(dnpName, "."))
    error.push(`"${dnpName}" is not a valid ENS domain`);

  // Validations that require external calls
  if (dnpName && repoInfo) {
    const { registryAddress, repoAddress, latestVersion } = repoInfo;
    if (registryAddress) success.push(`Registry found: ${registryAddress}`);
    else error.push(`"${dnpName}" does not have a valid registry`);
    if (repoAddress) success.push(`Repo already deployed at: ${repoAddress}`);
    else
      success.push(
        `A new repo will be deployed for the DAppNode Package "${dnpName}"`
      );
    if (latestVersion) success.push(`Latest version: ${latestVersion}`);
  }
  return cleanArrays({ error, success });
}

// =======
// VERSION
// =======

const isValidBump = (prevVersion, nextVersion) => {
  for (const type of ["patch", "minor", "major"]) {
    if (semver.inc(prevVersion, type) === nextVersion) return type;
  }
};

const getValidBumps = prevVersion =>
  ["patch", "minor", "major"]
    .map(type => semver.inc(prevVersion, type))
    .join(", ");

function getVersionInput(state) {
  const version = getQuery(state).version;
  const repoInfo = getQueryResultRepoInfo(state);
  const latestVersion = (repoInfo || {}).latestVersion;
  // Compute error messages + success message
  const error = [],
    success = [];
  // Validation that don't require external calls
  if (version) {
    if (semver.valid(version)) success.push(`Valid version`);
    else error.push("Sematic version must be valid, i.e. 0.1.7");
  }
  // Validations that require external calls
  if (semver.valid(version) && latestVersion) {
    const bumpType = isValidBump(latestVersion, version);
    if (bumpType) success.push(`Valid bump of type "${bumpType}"`);
    else
      error.push(
        `Next version is not a valid bump. Must be ${getValidBumps(
          latestVersion
        )}`
      );
  }
  return cleanArrays({ error, success });
}

// =================
// DEVELOPER ADDRESS
// =================

function getDeveloperAddressInput(state) {
  const developerAddress = getQuery(state).developerAddress;
  const repoInfo = getQueryResultRepoInfo(state);
  const { registryAddress, repoAddress } = repoInfo || {};
  // Compute error messages
  const error = [],
    success = [];
  if (developerAddress) {
    if (web3Utils.isAddress(developerAddress)) success.push(`Valid address`);
    else error.push("Must be a valid ethereum address");
  }
  return cleanArrays({ error, success, hide: !registryAddress || repoAddress });
}

// =============
// MANIFEST HASH
// =============

function getManifestHashInput(state) {
  const manifestIpfsHash = getQuery(state).manifestIpfsHash;
  const version = getQuery(state).version;
  const dnpName = getQuery(state).dnpName;
  const manifestResult = getQueryResultManifest(state);
  // Compute error messages
  const error = [],
    success = [];
  if (manifestIpfsHash) {
    if (isIpfsHash(manifestIpfsHash)) success.push(`Valid ipfs hash`);
    else error.push("Manifest hash must be a valid IPFS hash");
  }
  const { manifest } = manifestResult || {};
  if (
    manifestResult &&
    manifestIpfsHash &&
    manifestIpfsHash === manifestResult.hash &&
    manifest &&
    manifest.name &&
    manifest.version &&
    version &&
    dnpName
  ) {
    if (manifest.name === dnpName && manifest.version === version)
      success.push(`Manifest successfully verified`);
    else
      error.push(
        `Manifest verification failed. This manifest is for ${
          manifest.name
        } @ ${manifest.version}`
      );
  }
  return cleanArrays({ error, success });
}

// =============
// SUBMIT BUTTON
// =============

export function getButtonInput(state) {
  const repoInfo = getQueryResultRepoInfo(state);
  const metamaskInfo = getQueryResultMetamaskInfo(state);
  const allowedAddress = getQueryResultAllowedAddress(state);
  const callResult = getQueryResultCall(state);
  const ethereum = window.ethereum;

  const error = [],
    success = [];
  if (metamaskInfo) {
    let networkId = metamaskInfo.networkId || (ethereum || {}).networkVersion;
    // Validation that don't require external calls
    if (networkId && String(networkId) !== "1") {
      error.push(
        `Transactions must be published on mainnet. Please select "Main Network" on the metamask extension`
      );
    }
  }

  const connected = (metamaskInfo || {}).connected;
  let addressNotAllowed;

  // Validations that require external calls
  const userAddress = (ethereum || {}).selectedAddress;
  if (
    repoInfo &&
    allowedAddress &&
    repoInfo.repoAddress &&
    userAddress &&
    stringIncludes(repoInfo.repoAddress, allowedAddress.repoAddress) &&
    stringIncludes(userAddress, allowedAddress.userAddress)
  ) {
    if (allowedAddress.isAllowed) {
      success.push(`Selected address ${userAddress} is allowed to publish`);
    } else {
      error.push(`Selected address ${userAddress} is not allowed to publish`);
      addressNotAllowed = true;
    }
  }

  if (callResult) {
    if (callResult.type === "success") success.push(callResult.message);
    if (callResult.type === "error") error.push(callResult.message);
  }

  return cleanArrays({ error, success, connected, addressNotAllowed });
}

// ===================
// TRANSACTION PREVIEW
// ===================

export function getTransactionPreview(state) {
  const query = getQuery(state);
  const repoInfo = getQueryResultRepoInfo(state);
  const { dnpName, developerAddress, version, manifestIpfsHash } = query || {};
  const { registryAddress, repoAddress } = repoInfo || {};
  if (
    dnpName &&
    version &&
    manifestIpfsHash &&
    registryAddress &&
    (repoAddress || developerAddress)
  )
    return generatePublishTx({
      ensName: dnpName,
      manifestIpfsHash,
      version,
      developerAddress,
      registryAddress,
      repoAddress
    });
  else return null;
}

// Utils

function cleanArrays(obj) {
  for (const key of Object.keys(obj)) {
    if (Array.isArray(obj[key]) && !obj[key].length) {
      obj[key] = null;
    }
  }
  return obj;
}
