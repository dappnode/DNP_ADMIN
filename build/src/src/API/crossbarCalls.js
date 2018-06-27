import autobahn from "autobahn";
import * as AppActions from "actions/AppActions";
import uuidv4 from "uuid/v4";

import { toast } from "react-toastify";

const progressLog = {};

function shortName(ens) {
  if (!ens.includes(".")) return ens;
  return ens.split(".")[0];
}

function handleProgressLog(log) {
  // action.log = data (object), the object may contain
  // pkg: PACKAGE_NAME
  // clear: true
  // msg: 'download'
  // order: [packageName1, ...]
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

function formatProgressLog() {
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
let session; // make this variable global
start();

async function start() {
  const autobahnUrl = url;
  const autobahnRealm = realm;
  const connection = new autobahn.Connection({
    url: autobahnUrl,
    realm: autobahnRealm
  });

  connection.onopen = function(_session) {
    session = _session;
    console.log(
      "CONNECTED to DAppnode's WAMP " +
        "\n   url " +
        autobahnUrl +
        "\n   realm: " +
        autobahnRealm
    );

    session.subscribe("log.dappmanager.dnp.dappnode.eth", function(res) {
      let log = res[0];
      handleProgressLog(log);
      const task = tasks[log.logId];
      toast.update(task.toastId, {
        render: task.initText + " \n" + formatProgressLog(),
        className: "show-newlines"
      });
    });

    window.call = function(call, args) {
      return session.call(call, args).then(res => {
        return res;
      });
    };
  };

  connection.onclose = function(reason, details) {
    console.log("CONNECTION ERROR: ", "reason", reason, "details", details);
    // connection closed, lost or unable to connect
  };
  console.log("OPENING CONNECTION");
  connection.open();
}

///////////////////////////////
// Connection helper functions
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const maxAttempts = 4;

async function getSession() {
  for (let i = 0; i < maxAttempts; i++) {
    if (session) return session;
    await wait(250);
  }
  console.error("Session was not defined after #" + maxAttempts + " attempts");
}

// {"result":"ERR","resultStr":"QmWhzrpqcrR5N4xB6nR5iX9q3TyN5LUMxBLHdMedquR8nr it is not accesible"}"
/* DEVICE CALLS */

// ######
function parseResponse(resUnparsed) {
  return JSON.parse(resUnparsed);
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

  // Get the session object
  const _session = await getSession();

  // If session is not available, fail gently
  if (!_session) {
    if (pendingToast)
      pendingToast.resolve({
        success: false,
        message: "Can't connect to WAMP"
      });
    return;
  }

  // Call the session method
  const resUnparsed = await _session.call(event, args, kwargs);

  // Parse response
  const res = parseResponse(resUnparsed);

  // Update the toast or create a new one in case of error
  pendingToast.resolve(res);

  // Return the result
  return res.result;
}

/* Devices */

export const addDevice = (args = {}) =>
  call({
    event: "addDevice.vpn.dnp.dappnode.eth",
    args: [args.id],
    initText: "Adding " + args.id + "..."
  });

export const removeDevice = (args = {}) =>
  call({
    event: "removeDevice.vpn.dnp.dappnode.eth",
    args: [args.id],
    initText: "Removing " + args.id + "..."
  });

export const toggleAdmin = (args = {}) =>
  call({
    event: "toggleAdmin.vpn.dnp.dappnode.eth",
    args: [args.id],
    initText: "Toggling " + args.id + "admin credentials..."
  });

export const listDevices = () =>
  call({
    event: "listDevices.vpn.dnp.dappnode.eth"
  });

/* PACKAGE */

// TO IMPLEMENT: Prevent reinstallation, by checking in an array that the package is installing

//
// if (AppStore.getDisabled()[link]) {
//   toast.update(toastId, {
//     render: "Package " + link + " is already being installed",
//     type: toast.TYPE.ERROR,
//     autoClose: 5000
//   });
//   return;
// }

// Disable package installation
// AppActions.updateDisabled({ name: link, disabled: true });

export const addPackage = (args = {}) =>
  call({
    event: "installPackage.dappmanager.dnp.dappnode.eth",
    args: [args.id],
    initText: "Adding " + shortName(args.id) + "..."
  });

// AppActions.updateDisabled({ name: link, disabled: false });

// AppActions.updateProgressLog({ clear: true });

// "Removing package " + id + (deleteVolumes ? " and volumes" : ""),
// AFTER => listPackages(); listDirectory();

export const removePackage = (args = {}) =>
  call({
    event: "removePackage.dappmanager.dnp.dappnode.eth",
    args: [args.id],
    initText:
      "Removing package " +
      shortName(args.id) +
      (args.deleteVolumes ? " and volumes" : "")
  });

// "Toggling package " + id
// (id, isCORE)

export const togglePackage = (args = {}) =>
  call({
    event: "togglePackage.dappmanager.dnp.dappnode.eth",
    args: [args.id, args.isCORE],
    initText: "Toggling " + shortName(args.id)
  });

// "Restarting " + id + " " + (isCORE ? "(CORE)" : ""
// (id, isCORE)

export const restartPackage = (args = {}) =>
  call({
    event: "restartPackage.dappmanager.dnp.dappnode.eth",
    args: [args.id, args.isCORE],
    initText: "Restarting " + shortName(args.id)
  });

// "Restarting " + id + " " + (isCORE ? "(CORE)" : "") + " volumes"
// (id, isCORE)
// AFTER => listPackages();

export const restartPackageVolumes = (args = {}) =>
  call({
    event: "restartPackageVolumes.dappmanager.dnp.dappnode.eth",
    args: [args.id, args.isCORE],
    initText: "Restarting " + shortName(args.id) + " volumes"
  });

// "Updating " + id + " envs: " + JSON.stringify(envs)
// (id, envs, restart, isCORE)

export const updatePackageEnv = (args = {}) =>
  call({
    event: "updatePackageEnv.dappmanager.dnp.dappnode.eth",
    args: [args.id, args.envs, args.restart, args.isCORE],
    initText: "Updating " + args.id + " envs: " + JSON.stringify(args.envs)
  });

// ""
// (id, isCORE, options = {})

export const logPackage = (args = {}) =>
  call({
    event: "logPackage.dappmanager.dnp.dappnode.eth",
    args: [args.id, args.isCORE, args.options]
  });

// ""
// (id)

export const fetchPackageInfo = (args = {}) =>
  call({
    event: "fetchPackageInfo.dappmanager.dnp.dappnode.eth",
    args: [args.id]
  });

// ""
// ()

export const listPackages = () =>
  call({
    event: "listPackages.dappmanager.dnp.dappnode.eth"
  });

// ""
// ()

export const fetchDirectory = () =>
  call({
    event: "listDirectory.dappmanager.dnp.dappnode.eth"
  });

// IMPLEMENT - BEFORE CALL
// const chainStatus = AppStore.getChainStatus() || {};

//   if (chainStatus.isSyncing) {
//     console.warn("Mainnet is still syncing, preventing directory listing");
//     return;
//   }

// IMPLEMENT - AFTER CALL
//     // QUICK - First add current data to the store
//   for (const pkg of res.result) {
//     AppActions.updatePackageData({
//       name: pkg.name,
//       data: pkg
//     });
//   }
//     // SLOW - Then call for the additional package data
//   for (const pkg of res.result) {
//     await getPackageData(pkg.name);
//   }

// ""
// (id)

export const getPackageData = (args = {}) =>
  call({
    event: "getPackageData.dappmanager.dnp.dappnode.eth",
    args: [args.id]
  });

// IMPLEMENT - AFTER
//   if (res.success && res.result)
//     AppActions.updatePackageData({
//       name: id,
//       data: res.result
//     });
//   else {
//     AppActions.updatePackageData({
//       name: id,
//       data: { error: res.message }
//     });
