import uuidv4 from "uuid/v4";
import store from "../store";

/* Utils */

function assertKwargs(kwargs, keys) {
  keys.forEach(key => {
    if (!(key in kwargs))
      throw Error("Key " + key + " missing on " + JSON.stringify(kwargs));
  });
  return kwargs;
}

async function wrapCall({ event, args = [], kwargs = {} }) {
  try {
    // Generate a taskid
    if (!kwargs.logId) kwargs.logId = uuidv4();
    // Get session
    const session = store.getState().session;
    // If session is not available, fail gently
    if (!(session && session.isOpen)) {
      throw Error("Connection is not open");
    }
    const res = await session.call(event, args, kwargs).catch(e => {
      // crossbar return errors in a specific format
      throw Error(e.message || (e.args && e.args[0] ? e.args[0] : e.error));
    });
    // Return the result
    return JSON.parse(res);
  } catch (e) {
    return {
      success: false,
      message: e.message,
      e
    };
  }
}

function shortName(ens) {
  if (!ens) return ens;
  if (!ens.includes(".")) return ens;
  return ens.split(".")[0];
}

/* Devices */

export const addDevice = (kwargs = {}) =>
  wrapCall({
    event: "addDevice.vpn.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"])
  });

export const removeDevice = (kwargs = {}) =>
  wrapCall({
    event: "removeDevice.vpn.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"])
  });

export const toggleAdmin = (kwargs = {}) =>
  wrapCall({
    event: "toggleAdmin.vpn.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"])
  });

export const fetchDevices = () =>
  wrapCall({
    event: "listDevices.vpn.dnp.dappnode.eth"
  });

export const getVpnParams = () =>
  wrapCall({
    event: "getParams.vpn.dappnode.eth"
  });

export const getStatusUPnP = () =>
  wrapCall({
    event: "statusUPnP.vpn.dnp.dappnode.eth"
  });

export const getStatusExternalIp = () =>
  wrapCall({
    event: "statusExternalIp.vpn.dnp.dappnode.eth"
  });

/* PACKAGE */

// installPackage CALL DOCUMENTATION:
// > kwargs: { id }
// > result: {}

export const installPackage = (kwargs = {}) =>
  wrapCall({
    event: "installPackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"])
  });

export const installPackageSafe = (kwargs = {}) =>
  wrapCall({
    event: "installPackageSafe.dnp.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"])
  });

// removePackage CALL DOCUMENTATION:
// > kwargs: { id, deleteVolumes }
// > result: {}

export const removePackage = (kwargs = {}) =>
  wrapCall({
    event: "removePackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id", "deleteVolumes"])
  });

// togglePackage CALL DOCUMENTATION:
// > kwargs: { id, timeout }
// > result: {}

export const togglePackage = (kwargs = {}) =>
  wrapCall({
    event: "togglePackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Toggling " + shortName(kwargs.id)
  });

// restartPackage CALL DOCUMENTATION:
// > kwargs: { id }
// > result: {}

export const restartPackage = (kwargs = {}) =>
  wrapCall({
    event: "restartPackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Restarting " + shortName(kwargs.id)
  });

// restartVolumes CALL DOCUMENTATION:
// > kwargs: { id, deleteVolumes }
// > result: {}

export const restartVolumes = (kwargs = {}) =>
  wrapCall({
    event: "restartPackageVolumes.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Restarting " + shortName(kwargs.id) + " volumes"
  });

// updatePackageEnv CALL DOCUMENTATION:
// > kwargs: { id, envs, restart, isCORE }
// > result: {}

export const updatePackageEnv = (kwargs = {}) =>
  wrapCall({
    event: "updatePackageEnv.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id", "envs", "restart"])
  });

// logPackage CALL DOCUMENTATION:
// > kwargs: { id, options }
// > result: { id, logs = <string> }

export const logPackage = (kwargs = {}) =>
  wrapCall({
    event: "logPackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id", "options"])
  });

// managePorts CALL DOCUMENTATION:
// > kwargs: { ports, logId }
// > result: {}

export const managePorts = (kwargs = {}) =>
  wrapCall({
    event: "managePorts.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["ports", "action"])
  });

// getUserActionLogs CALL DOCUMENTATION:
// > kwargs: {}
// > result: logs = <string>

export const getUserActionLogs = () =>
  wrapCall({
    event: "getUserActionLogs.dappmanager.dnp.dappnode.eth"
  });

// fetchPackageVersions CALL DOCUMENTATION:
// > kwargs: { id }
// > result: [{
//     version: '0.0.4', (string)
//     manifest: <Manifest> (object)
//   },
//   ...]

export const fetchPackageVersions = (kwargs = {}) =>
  wrapCall({
    event: "fetchPackageVersions.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"])
  });

// listPackages CALL DOCUMENTATION:
// > kwargs: {}
// > result: [{
//     id: '927623894...', (string)
//     isDNP: true, (boolean)
//     created: <Date string>,
//     image: <Image Name>, (string)
//     name: otpweb.dnp.dappnode.eth, (string)
//     shortName: otpweb, (string)
//     version: '0.0.4', (string)
//     ports: <list of ports>, (string)
//     state: 'exited', (string)
//     running: true, (boolean)
//     ...
//     envs: <Env variables> (object)
//   },
//   ...]

export const listPackages = () =>
  wrapCall({
    event: "listPackages.dappmanager.dnp.dappnode.eth"
  });

// fetchDirectory CALL DOCUMENTATION:
// > kwargs: {}
// > result: [{
//     name,
//     status
//   },
//   ...]

export const fetchDirectory = () =>
  wrapCall({
    event: "fetchDirectory.dappmanager.dnp.dappnode.eth"
  });

// IMPLEMENT - BEFORE CALL
// const chainStatus = AppStore.getChainStatus() || {};

//   if (chainStatus.isSyncing) {
//     console.warn("Mainnet is still syncing, preventing directory listing");
//     return;
//   }

// getPackageData CALL DOCUMENTATION:
// > kwargs: { id }
// > result: {
//     manifest,
//     avatar
//   }

export const fetchPackageData = (kwargs = {}) =>
  wrapCall({
    event: "fetchPackageData.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"])
  });

// resolveRequest CALL DOCUMENTATION:
// > kwargs: { req }
// > result: [{
//     success,
//     errors,
//     state,
//     casesChecked,
//     totalCases,
//     hasTimedOut,
//   },
//   ...]

export const resolveRequest = (kwargs = {}) =>
  wrapCall({
    event: "resolveRequest.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["req"])
  });
