import autobahn from 'autobahn';
import * as AppActions from 'Action';
import AppStore from 'Store';

import { toast } from 'react-toastify';

// let url = 'ws://localhost:8080/ws';
// let url = 'ws://206.189.162.209:8080/ws';
// Produccion
let url = 'ws://my.wamp.dnp.dappnode.eth:8080/ws'
let realm = 'dappnode_admin'

// Initalize app
let session; // make this variable global
start()

async function start() {

  const autobahnUrl = url
  const autobahnRealm = realm
  const connection = new autobahn.Connection({
    url: autobahnUrl,
    realm: autobahnRealm,
  })

  connection.onopen = function (_session) {
    session = _session;
    console.log("CONNECTED to DAppnode's WAMP "+
      "\n   url "+autobahnUrl+
      "\n   realm: "+autobahnRealm)

    setTimeout(function(){
      listDevices()
      listPackages()
      listDirectory()
    }, 300);

    session.subscribe("log.installer.repo.dappnode.eth", function(res){
      let log = res[0]
      AppActions.updateProgressLog(log)
    })
  }

  connection.open();
}


///////////////////////////////
// Connection helper functions


let handleResponseMessage = function(res, successMessage) {
  if (res.result == 'OK'){
    AppActions.updateLogMessage({
      success: true,
      msg: successMessage
    });
  } else if ('resultStr' in res){
    AppActions.updateLogMessage({
      success: false,
      msg: res.resultStr
    });
  } else {
    AppActions.updateLogMessage({
      success: false,
      msg: 'Unkown response format '+JSON.stringify(res)
    });
  }
}

// {"result":"ERR","resultStr":"QmWhzrpqcrR5N4xB6nR5iX9q3TyN5LUMxBLHdMedquR8nr it is not accesible"}"
/* DEVICE CALLS */

export function addDevice(name) {
  // Ensure name contains only alphanumeric characters
  const correctedName = name.replace(/\W/g, '')

  console.log('Adding device, name: ',correctedName);
  session.call('addDevice.vpn.repo.dappnode.eth', [correctedName]).then(
    function (resUnparsed) {
      let res = parseResponse(resUnparsed)
      console.log('Adding device RES',res)
      handleResponseMessage(res, 'Device successfully added');
      listDevices();
    }
  );
};

export function removeDevice(deviceName) {
  console.log('Removing device, id: ',deviceName)
  session.call('removeDevice.vpn.repo.dappnode.eth', [deviceName]).then(
    function (resUnparsed) {
      let res = parseResponse(resUnparsed)
      console.log('Removing device RES',res)
      handleResponseMessage(res, 'Device successfully removed')
      listDevices();
    }
  );
};

export function listDevices() {
  console.log('Listing devices')
  session.call('listDevices.vpn.repo.dappnode.eth', []).then(
    function (resUnparsed) {
      let res = parseResponse(resUnparsed)
      console.log('Listing devices RES ',res)
      AppActions.updateDeviceList(res.devices);
    }
  );
};


/* PACKAGE */


export async function addPackage(link) {

  let toastId = toast('Adding package ' + link, { autoClose: false });

  let resUnparsed = await session.call('installPackage.installer.dnp.dappnode.eth', [link])
  let res = parseResponse(resUnparsed)

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  AppActions.updateProgressLog({clear: true})
  updateData()

};


export async function removePackage(id, deleteVolumes) {

  let toastId = toast('Removing package ' + id + (deleteVolumes ? ' and volumes' : ''), { autoClose: false });

  let resUnparsed = await session.call('removePackage.installer.dnp.dappnode.eth', [id, deleteVolumes])
  let res = parseResponse(resUnparsed)

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  updateData()

};


export async function togglePackage(id) {

  let toastId = toast('Toggling package ' + id, { autoClose: false });

  let resUnparsed = await session.call('togglePackage.installer.dnp.dappnode.eth', [id])
  let res = parseResponse(resUnparsed)

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  updateData()

};


export async function restartPackage(id, isCORE) {

  let toastId = toast('Restarting '+id+' '+(isCORE ? '(CORE)' : ''), { autoClose: false });

  let resUnparsed = await session.call('restartPackage.installer.dnp.dappnode.eth', [id, isCORE])
  let res = parseResponse(resUnparsed)

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  updateData()

};


export async function restartPackageVolumes(id, isCORE) {

  let toastId = toast('Restarting '+id+' '+(isCORE ? '(CORE)' : '')+' volumes', { autoClose: false });
  let resUnparsed = await session.call('restartPackageVolumes.installer.dnp.dappnode.eth', [id, isCORE])
  let res = parseResponse(resUnparsed)

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  updateData()

};



// ######
function parseResponse(resUnparsed) {
  return JSON.parse(resUnparsed)
}

function updateData() {
  listPackages()
  listDirectory()
}


export async function updatePackageEnv(id, envs, restart) {

  let toastId = toast('Updating '+id+' envs: '+JSON.stringify(envs), { autoClose: false });

  let resUnparsed = await session.call('updatePackageEnv.installer.dnp.dappnode.eth', [id, JSON.stringify(envs), restart])
  let res = parseResponse(resUnparsed)

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  updateData()

};

export async function logPackage(id, isCORE) {

  let toastId = toast('Logging '+id+(isCORE ? ' (CORE)' : ''), { autoClose: false });

  let resUnparsed = await session.call('logPackage.installer.dnp.dappnode.eth', [id, isCORE])
  let res = parseResponse(resUnparsed)

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  if (res.success && res.result && res.result.logs)
    AppActions.updatePackageLog(id, res.result.logs)

  updateData()

};


export async function fetchPackageInfo(id) {

  let toastId = toast('Fetching '+id+' info', { autoClose: false });

  let resUnparsed = await session.call('fetchPackageInfo.installer.dnp.dappnode.eth', [id])
  let res = parseResponse(resUnparsed)

  toast.update(toastId, {
    render: res.message,
    type: res.success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    autoClose: 5000
  });

  if (res.success && res.result)
    AppActions.updatePackageInfo(id, res.result)

  updateData()

};

export async function listPackages() {

  let resUnparsed = await session.call('listPackages.installer.repo.dappnode.eth', [])
  let res = parseResponse(resUnparsed)

  if (res.success && res.result)
    AppActions.updatePackageList(res.result)
  else
    toast.error("Error listing packages: "+res.message)

};

export async function listDirectory() {
  // [ { name: 'rinkeby.dnp.dappnode.eth',
  //   status: 'Preparing',
  //   versions: [ '0.0.1', '0.0.2' ] },

  let resUnparsed = await session.call('listDirectory.installer.repo.dappnode.eth', [])
  let res = parseResponse(resUnparsed)

  if (res.success && res.result)
    AppActions.updateDirectory(res.result)
  else
    toast.error("Error listing packages: "+res.message)

};
