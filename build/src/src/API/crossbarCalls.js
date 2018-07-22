import autobahn from "autobahn";
import uuidv4 from "uuid/v4";
import { toast } from "react-toastify";
import eventBus from "eventBus";

const progressLogs = {};

function shortName(ens) {
  if (!ens) return ens;
  if (!ens.includes(".")) return ens;
  return ens.split(".")[0];
}

function handleProgressLog(id, log) {
  // action.log = data (object), the object may contain
  // pkg: PACKAGE_NAME
  // clear: true
  // msg: 'download'
  // order: [packageName1, ...]
  if (!(id in progressLogs)) progressLogs[id] = {};
  let progressLog = progressLogs[id] || {};
  if (!("msg" in progressLog)) progressLog.msg = {};
  if (!("order" in progressLog)) progressLog.order = ["all"];

  if (log.clear) {
    progressLog.msg = {};
    progressLog.order = [];
  }
  if (log.order) {
    log.order.forEach((name, i) => {
      progressLog.order.push(name);
    });
  }
  if (log.pkg) {
    progressLog.msg[log.pkg] = log.msg;
  }
}

function formatProgressLog(id) {
  const progressLog = progressLogs[id] || {};
  const msgs = progressLog.msg || {};
  const pakagesOrder = progressLog.order || [];
  return pakagesOrder
    .map((name, i) => shortName(name) + ": " + (msgs[name] || "loading..."))
    .join(", \n");
}

const tasks = {};

// let url = 'ws://localhost:8080/ws';
// let url = 'ws://206.189.162.209:8080/ws';
// Produccion
let url = "ws://my.wamp.dnp.dappnode.eth:8080/ws";
let realm = "dappnode_admin";

// Initalize app
let session, sessionExternal; // make this variable global
start().then(_session => {
  session = _session;
});

export const getSessionSync = () => sessionExternal;
export const isOpen = () => Boolean(session && session.isOpen);

function start() {
  return new Promise((resolve, reject) => {
    const autobahnUrl = url;
    const autobahnRealm = realm;
    const connection = new autobahn.Connection({
      url: autobahnUrl,
      realm: autobahnRealm
    });

    connection.onopen = function(_session) {
      eventBus.publish("connection_open", _session);
      console.log(
        "CONNECTED to DAppnode's WAMP " +
          "\n   url " +
          autobahnUrl +
          "\n   realm: " +
          autobahnRealm
      );
      sessionExternal = session = _session;

      session.subscribe("log.dappmanager.dnp.dappnode.eth", function(res) {
        let log = res[0];
        handleProgressLog(log.logId, log);
        const task = tasks[log.logId];
        toast.update(task.toastId, {
          render: task.initText + " \n" + formatProgressLog(log.logId),
          className: "show-newlines"
        });
      });

      window.call = function(call, args) {
        return session.call(call, args).then(res => {
          return res;
        });
      };
      resolve(session);
    };

    connection.onclose = function(reason, details) {
      eventBus.publish(
        "connection_close",
        (sessionExternal = {
          reason,
          message: details ? details.message || "" : ""
        })
      );
      reject();
      // connection closed, lost or unable to connect
    };
    console.log("OPENING CONNECTION");
    try {
      connection.open();
    } catch (e) {
      console.log(e);
    }
  });
}

///////////////////////////////
// Connection helper functions

/* DEVICE CALLS */

// ######
function parseResponse(resUnparsed) {
  const resObject = JSON.parse(resUnparsed);
  if ("success" in resObject && "message" in resObject) return resObject;
  return {
    success: false,
    message: "reponse object in not correctly formated: " + resUnparsed
  };
}

function PendingToast(initText) {
  const defaultOptions = res => ({
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 5000,
    type: res ? (res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR) : null
  });

  this.id =
    initText || initText !== ""
      ? toast(initText, {
          ...defaultOptions(null),
          autoClose: false
        })
      : undefined;

  this.resolve = res => {
    if (this.id && toast.isActive(this.id))
      // Existing toast, update
      toast.update(this.id, {
        ...defaultOptions(res),
        render: res.message
      });
    else if (!this.id && res.success)
      // On not initialized toast's success don't show
      return;
    // Rest of cases, show new toast
    else
      toast.error(res.message, {
        ...defaultOptions(res)
      });
  };
}

async function call({ event, args = [], kwargs = {}, initText = "" }) {
  // Generate a taskid
  const taskId = uuidv4();
  kwargs.logId = taskId;

  // Initialize a toast if requested
  const pendingToast = new PendingToast(initText);
  // Store the information globally
  tasks[taskId] = { id: taskId, toastId: pendingToast.id, initText };

  // If session is not available, fail gently
  if (!(session && session.isOpen)) {
    pendingToast.resolve({
      success: false,
      message: "Can't connect to DAppNode's WAMP"
    });
    return;
  }

  // Call the session method
  const resUnparsed = await session.call(event, args, kwargs);

  // Parse response
  const res = parseResponse(resUnparsed);

  // Update the toast or create a new one in case of error
  pendingToast.resolve(res);

  // Return the result
  return res.result;
}

function assertKwargs(kwargs, keys) {
  keys.forEach(key => {
    if (!(key in kwargs))
      throw Error("Key " + key + " missing on " + JSON.stringify(kwargs));
  });
  return kwargs;
}

/* Devices */

export const addDevice = (kwargs = {}) =>
  call({
    event: "addDevice.vpn.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Adding " + kwargs.id + "..."
  });

export const removeDevice = (kwargs = {}) =>
  call({
    event: "removeDevice.vpn.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Removing " + kwargs.id + "..."
  });

export const toggleAdmin = (kwargs = {}) =>
  call({
    event: "toggleAdmin.vpn.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Toggling " + kwargs.id + "admin credentials..."
  });

export const fetchDevices = () =>
  call({
    event: "listDevices.vpn.dnp.dappnode.eth"
  });

export const getVpnParams = () =>
  call({
    event: "getParams.vpn.dappnode.eth"
  });

export const getStatusUPnP = () =>
  call({
    event: "statusUPnP.vpn.dnp.dappnode.eth"
  });

export const getStatusExternalIp = () =>
  call({
    event: "statusExternalIp.vpn.dnp.dappnode.eth"
  });

/* PACKAGE */

// addPackage CALL DOCUMENTATION:
// > kwargs: { id }
// > result: {}

export const addPackage = (kwargs = {}) =>
  call({
    event: "installPackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Adding " + shortName(kwargs.id) + "..."
  });

// removePackage CALL DOCUMENTATION:
// > kwargs: { id, deleteVolumes }
// > result: {}

export const removePackage = (kwargs = {}) =>
  call({
    event: "removePackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id", "deleteVolumes"]),
    initText:
      "Removing package " +
      shortName(kwargs.id) +
      (kwargs.deleteVolumes ? " and volumes" : "")
  });

// togglePackage CALL DOCUMENTATION:
// > kwargs: { id, timeout }
// > result: {}

export const togglePackage = (kwargs = {}) =>
  call({
    event: "togglePackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Toggling " + shortName(kwargs.id)
  });

// restartPackage CALL DOCUMENTATION:
// > kwargs: { id }
// > result: {}

export const restartPackage = (kwargs = {}) =>
  call({
    event: "restartPackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Restarting " + shortName(kwargs.id)
  });

// restartVolumes CALL DOCUMENTATION:
// > kwargs: { id, deleteVolumes }
// > result: {}

export const restartVolumes = (kwargs = {}) =>
  call({
    event: "restartPackageVolumes.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"]),
    initText: "Restarting " + shortName(kwargs.id) + " volumes"
  });

// updatePackageEnv CALL DOCUMENTATION:
// > kwargs: { id, envs, restart, isCORE }
// > result: {}

export const updatePackageEnv = (kwargs = {}) =>
  call({
    event: "updatePackageEnv.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id", "envs", "restart"]),
    initText: "Updating " + kwargs.id + " envs: " + JSON.stringify(kwargs.envs)
  });

// logPackage CALL DOCUMENTATION:
// > kwargs: { id, options }
// > result: { id, logs = <string> }

export const logPackage = (kwargs = {}) =>
  call({
    event: "logPackage.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id", "options"])
  });

// fetchPackageVersions CALL DOCUMENTATION:
// > kwargs: { id }
// > result: [{
//     version: '0.0.4', (string)
//     manifest: <Manifest> (object)
//   },
//   ...]

export const fetchPackageVersions = (kwargs = {}) =>
  call({
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
  call({
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
  call({
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
  call({
    event: "fetchPackageData.dappmanager.dnp.dappnode.eth",
    kwargs: assertKwargs(kwargs, ["id"])
  });
