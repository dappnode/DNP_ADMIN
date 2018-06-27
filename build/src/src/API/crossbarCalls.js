import autobahn from "autobahn";
import * as AppActions from "actions/AppActions";
import AppStore from "stores/AppStore";

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

    setTimeout(function() {
      getVpnParams();
      listDevices();
      listPackages();
      listDirectory();
    }, 300);

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

// ######
function parseResponse(resUnparsed) {
  return JSON.parse(resUnparsed);
}

// {"result":"ERR","resultStr":"QmWhzrpqcrR5N4xB6nR5iX9q3TyN5LUMxBLHdMedquR8nr it is not accesible"}"
/* DEVICE CALLS */

export async function getVpnParams() {
  let resUnparsed = await session.call("getParams.vpn.dappnode.eth", []);
  let res = parseResponse(resUnparsed);

  if (res)
    AppActions.updateVpnParams({
      IP: res.VPN.IP,
      NAME: res.VPN.NAME
    });
  else
    toast.error("Error fetching VPN parameters", {
      position: toast.POSITION.BOTTOM_RIGHT
    });
}

export async function addDevice(name) {
  // Ensure name contains only alphanumeric characters
  const correctedName = name.replace(/\W/g, "");

  let toastId = toast("Adding device: " + correctedName, {
    autoClose: false,
    position: toast.POSITION.BOTTOM_RIGHT
  });

  let resUnparsed = await session.call("addDevice.vpn.dnp.dappnode.eth", [
    correctedName
  ]);
  let res = parseResponse(resUnparsed);

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  listDevices();
}

export async function removeDevice(deviceName) {
  let toastId = toast("Removing device: " + deviceName, {
    autoClose: false,
    position: toast.POSITION.BOTTOM_RIGHT
  });

  let resUnparsed = await session.call("removeDevice.vpn.dnp.dappnode.eth", [
    deviceName
  ]);
  let res = parseResponse(resUnparsed);

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  listDevices();
}

export async function toggleAdmin(deviceName, isAdmin) {
  let toastId = toast(
    isAdmin
      ? "Giving admin credentials to " + deviceName
      : "Removing admin credentials from " + deviceName,
    {
      autoClose: false,
      position: toast.POSITION.BOTTOM_RIGHT
    }
  );

  let resUnparsed = await session.call("toggleAdmin.vpn.dnp.dappnode.eth", [
    deviceName
  ]);
  let res = parseResponse(resUnparsed);

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  listDevices();
}

export async function listDevices() {
  let resUnparsed = await session.call("listDevices.vpn.dnp.dappnode.eth", []);
  let res = parseResponse(resUnparsed);

  if (res.success && res.result) AppActions.updateDeviceList(res.result);
  else
    toast.error("Error listing devices: " + res.message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
}

/* PACKAGE */

export async function addPackage(link) {
  let toastId = toast("Adding package " + link, {
    autoClose: false,
    position: toast.POSITION.BOTTOM_RIGHT
  });

  // Prevent reinstallation
  if (AppStore.getDisabled()[link]) {
    toast.update(toastId, {
      render: "Package " + link + " is already being installed",
      type: toast.TYPE.ERROR,
      autoClose: 5000
    });
    return;
  }

  // Disable package installation
  AppActions.updateDisabled({ name: link, disabled: true });

  let resUnparsed = await session.call(
    "installPackage.dappmanager.dnp.dappnode.eth",
    [link]
  );
  let res = parseResponse(resUnparsed);

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  // Enable package installation
  AppActions.updateDisabled({ name: link, disabled: false });

  AppActions.updateProgressLog({ clear: true });

  listPackages();
  listDirectory();
}

export async function removePackage(id, deleteVolumes) {
  let toastId = toast(
    "Removing package " + id + (deleteVolumes ? " and volumes" : ""),
    {
      autoClose: false,
      position: toast.POSITION.BOTTOM_RIGHT
    }
  );

  let resUnparsed = await session.call(
    "removePackage.dappmanager.dnp.dappnode.eth",
    [id, deleteVolumes]
  );
  let res = parseResponse(resUnparsed);

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  listPackages();
  listDirectory();
}

export async function togglePackage(id, isCORE) {
  let toastId = toast("Toggling package " + id, {
    autoClose: false,
    position: toast.POSITION.BOTTOM_RIGHT
  });

  let resUnparsed = await session.call(
    "togglePackage.dappmanager.dnp.dappnode.eth",
    [id]
  );
  let res = parseResponse(resUnparsed);

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  listPackages();
}

export async function restartPackage(id, isCORE) {
  let toastId = toast("Restarting " + id + " " + (isCORE ? "(CORE)" : ""), {
    autoClose: false,
    position: toast.POSITION.BOTTOM_RIGHT
  });

  let resUnparsed = await session.call(
    "restartPackage.dappmanager.dnp.dappnode.eth",
    [id, isCORE]
  );
  let res = parseResponse(resUnparsed);

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  listPackages();
}

export async function restartPackageVolumes(id, isCORE) {
  let toastId = toast(
    "Restarting " + id + " " + (isCORE ? "(CORE)" : "") + " volumes",
    {
      autoClose: false,
      position: toast.POSITION.BOTTOM_RIGHT
    }
  );

  let resUnparsed = await session.call(
    "restartPackageVolumes.dappmanager.dnp.dappnode.eth",
    [id, isCORE]
  );
  let res = parseResponse(resUnparsed);

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  listPackages();
}

export async function updatePackageEnv(id, envs, restart, isCORE) {
  let toastId = toast("Updating " + id + " envs: " + JSON.stringify(envs), {
    autoClose: false,
    position: toast.POSITION.BOTTOM_RIGHT
  });

  let resUnparsed = await session.call(
    "updatePackageEnv.dappmanager.dnp.dappnode.eth",
    [id, JSON.stringify(envs), restart, isCORE]
  );
  let res = parseResponse(resUnparsed);

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  listPackages();
}

export async function logPackage(id, isCORE, options = {}) {
  let resUnparsed = await session.call(
    "logPackage.dappmanager.dnp.dappnode.eth",
    [id, isCORE, JSON.stringify(options)]
  );
  let res = parseResponse(resUnparsed);

  if (res.success && res.result && res.result.hasOwnProperty("logs"))
    AppActions.updatePackageLog(id, res.result.logs);
  else
    toast.error("Error logging " + id + ": " + res.message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
}

export async function fetchPackageInfo(id) {
  let resUnparsed = await session.call(
    "fetchPackageInfo.dappmanager.dnp.dappnode.eth",
    [id]
  );
  let res = parseResponse(resUnparsed);

  if (res.success && res.result) AppActions.updatePackageInfo(id, res.result);
  else
    toast.error("Error fetching versions of " + id + ": " + res.message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
}

export async function listPackages() {
  let resUnparsed = await session.call(
    "listPackages.dappmanager.dnp.dappnode.eth",
    []
  );
  let res = parseResponse(resUnparsed);

  if (res.success && res.result) AppActions.updatePackageList(res.result);
  else
    toast.error("Error listing packages: " + res.message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
}

export async function listDirectory() {
  // [ { name: 'rinkeby.dnp.dappnode.eth',
  //   status: 'Preparing',
  //   versions: [ '0.0.1', '0.0.2' ] },
  const chainStatus = AppStore.getChainStatus() || {};

  if (chainStatus.isSyncing) {
    console.warn("Mainnet is still syncing, preventing directory listing");
    return;
  }

  let resUnparsed = await session.call(
    "listDirectory.dappmanager.dnp.dappnode.eth",
    []
  );
  let res = parseResponse(resUnparsed);

  if (res.success && res.result) {
    // QUICK - First add current data to the store
    for (const pkg of res.result) {
      AppActions.updatePackageData({
        name: pkg.name,
        data: pkg
      });
    }
    // SLOW - Then call for the additional package data
    for (const pkg of res.result) {
      await getPackageData(pkg.name);
    }
  } else {
    toast.error("Error fetching directory: " + res.message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  }
}

async function getPackageData(id) {
  let resUnparsed = await session.call(
    "getPackageData.dappmanager.dnp.dappnode.eth",
    [id]
  );
  let res = parseResponse(resUnparsed);

  if (res.success && res.result)
    AppActions.updatePackageData({
      name: id,
      data: res.result
    });
  else {
    AppActions.updatePackageData({
      name: id,
      data: { error: res.message }
    });

    toast.error("Package " + id + " is unavailable: " + res.message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  }
}
