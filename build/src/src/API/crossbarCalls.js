import autobahn from "autobahn";
import * as AppActions from "actions/AppActions";

import { toast } from "react-toastify";

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
      AppActions.updateProgressLog(log);
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

function PendingToast(text) {
  this.id = toast(text, {
    autoClose: false,
    position: toast.POSITION.BOTTOM_RIGHT
  });
  this.resolve = res => {
    toast.update(this.id, {
      render: res.message,
      type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
      autoClose: 5000
    });
  };
}

function to(promise) {
  let res, err, opt;
  return promise
    .then(
      _res => {
        res = _res;
      },
      _err => {
        err = _err;
      },
      _opt => {
        opt = _opt;
      }
    )
    .then(() => ({ res, err, opt }));
}

function call(event, initText = "") {
  return async function() {
    // Initialize a toast if requested
    const pendingToast = initText !== "" ? new PendingToast(initText) : null;

    // Construct an array with the argument of the function, works good with 0, 1, and N arguments
    const args =
      arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
    const kwargs = {};

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
    const { res: resUnparsed, opt: progress } = await to(
      _session.call(event, args, kwargs, {
        receive_progress: true
      })
    );

    console.log("PROGRESS", progress);

    // Parse response
    const res = parseResponse(resUnparsed);

    // Update the toast or create a new one in case of error
    if (initText !== "") pendingToast.resolve(res);
    else if (!res.success)
      toast.error("Error listing devices: " + res.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      });

    // Return the result
    return res.result;
  };
}

export const addDevice = call(
  "addDevice.vpn.dnp.dappnode.eth",
  "Adding device..."
);
export const removeDevice = call(
  "removeDevice.vpn.dnp.dappnode.eth",
  "Removing device..."
);
export const toggleAdmin = call(
  "toggleAdmin.vpn.dnp.dappnode.eth",
  "Toggling admin credentials..."
);
export const listDevices = call("listDevices.vpn.dnp.dappnode.eth");

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

export const addPackage = call(
  "installPackage.dappmanager.dnp.dappnode.eth",
  "Adding package..."
);

// AppActions.updateDisabled({ name: link, disabled: false });

// AppActions.updateProgressLog({ clear: true });

// "Removing package " + id + (deleteVolumes ? " and volumes" : ""),
// AFTER => listPackages(); listDirectory();

export const removePackage = call(
  "removePackage.dappmanager.dnp.dappnode.eth",
  "Removing package..."
);

// "Toggling package " + id
// (id, isCORE)

export const togglePackage = call(
  "togglePackage.dappmanager.dnp.dappnode.eth",
  "Toggling package..."
);

// "Restarting " + id + " " + (isCORE ? "(CORE)" : ""
// (id, isCORE)

export const restartPackage = call(
  "restartPackage.dappmanager.dnp.dappnode.eth",
  "Restarting package..."
);

// "Restarting " + id + " " + (isCORE ? "(CORE)" : "") + " volumes"
// (id, isCORE)
// AFTER => listPackages();

export const restartPackageVolumes = call(
  "restartPackageVolumes.dappmanager.dnp.dappnode.eth",
  "Restarting package volumes..."
);

// "Updating " + id + " envs: " + JSON.stringify(envs)
// (id, envs, restart, isCORE)

export const updatePackageEnv = call(
  "updatePackageEnv.dappmanager.dnp.dappnode.eth",
  "Updating package envs..."
);

// ""
// (id, isCORE, options = {})

export const logPackage = call("logPackage.dappmanager.dnp.dappnode.eth");

// ""
// (id)

export const fetchPackageInfo = call(
  "fetchPackageInfo.dappmanager.dnp.dappnode.eth"
);

// ""
// ()

export const listPackages = call("listPackages.dappmanager.dnp.dappnode.eth");

// ""
// ()

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

export const fetchDirectory = call(
  "listDirectory.dappmanager.dnp.dappnode.eth"
);

// ""
// (id)

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

export const getPackageData = call(
  "getPackageData.dappmanager.dnp.dappnode.eth"
);
