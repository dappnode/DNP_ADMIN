import autobahn from 'autobahn';
import * as AppActions from 'Action';
import AppStore from 'Store';

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

    listDevices()
    listPackages()
    listDirectory()

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
  console.log('Adding device, name: ',name);
  session.call('addDevice.vpn.repo.dappnode.eth', [name]).then(
    function (res) {
      let resParsed = JSON.parse(res)
      console.log('Adding device RES',resParsed)
      handleResponseMessage(resParsed, 'Device successfully added');
      listDevices();
    }
  );
};

export function removeDevice(deviceName) {
  console.log('Removing device, id: ',deviceName)
  session.call('removeDevice.vpn.repo.dappnode.eth', [deviceName]).then(
    function (res) {
      let resParsed = JSON.parse(res)
      console.log('Removing device RES',resParsed)
      handleResponseMessage(resParsed, 'Device successfully removed')
      listDevices();
    }
  );
};

export function listDevices() {
  console.log('Listing devices')
  session.call('listDevices.vpn.repo.dappnode.eth', []).then(
    function (res) {
      let resParsed = JSON.parse(res)
      console.log('Listing devices RES ',resParsed)
      AppActions.updateDeviceList(resParsed.devices);
    }
  );
};

/* PACKAGE */
function createHandleRPCResponse (component, displaySuccessAndError = true) {

  return function handleRPCResponse(res) {

    let resParsed = JSON.parse(res)
    console.log('handlePackageResponse: ',resParsed)
    // resParsed = {
    //   success: true / false,
    //   message: "String"
    //   result: [optional]
    // }
    // 'installer'
    if (displaySuccessAndError || !resParsed.success) {
      AppActions.updateLog({
        component,
        topic: 'RPC CALL',
        msg:  resParsed.message,
        type: resParsed.success ? "success" : "error"
      });
    }

    listPackages()
    listDirectory()

  }
}


export function addPackage(link) {

  console.log('Adding package, link: ',link);
  AppActions.updateLog({
    component: 'installer',
    topic: 'RPC CALL',
    msg:  'Adding package ' + link,
  });

  session
    .call('installPackage.installer.dnp.dappnode.eth', [link])
    .then(createHandleRPCResponse('installer'))
    .then(() => {
      AppActions.updateProgressLog({clear: true}) // #### autocleaning progress log
    })
};

export function removePackage(id) {

  console.log('Removing package, id: ',id)
  AppActions.updateLog({
    component: 'packageManager',
    topic: 'RPC CALL',
    msg:  'Removing package... ',
  });

  session
    .call('removePackage.installer.dnp.dappnode.eth', [id])
    .then(createHandleRPCResponse('packageManager'));
};

export function togglePackage(id) {

  console.log('Toggling package, id: ',id)
  AppActions.updateLog({
    component: 'packageManager',
    topic: 'RPC CALL',
    msg:  'Toggling package... ',
  });

  session
    .call('togglePackage.installer.dnp.dappnode.eth', [id])
    .then(createHandleRPCResponse('packageManager'));
};

export function updatePackageEnv(id, envs, restart) {

  console.log('Updating package envs, id: ',id,' envs: ',envs)

  session
    .call('updatePackageEnv.installer.dnp.dappnode.eth', [id, JSON.stringify(envs), restart])
    .then(createHandleRPCResponse('packageManager', false))
};

export function logPackage(id) {

  console.log('Logging package, id: ',id)

  session.call('logPackage.installer.dnp.dappnode.eth', [id]).then(
    function (res) {
      let resParsed = JSON.parse(res)
      AppActions.updatePackageLog(id, resParsed.result.logs)
    }
  );

};

export function fetchPackageInfo(id) {

  console.log('Fetching package info, id: ',id)

  session.call('fetchPackageInfo.installer.dnp.dappnode.eth', [id]).then(
    function (res) {
      let resParsed = JSON.parse(res)
      AppActions.updatePackageInfo(id, resParsed.result)
    }
  );

};

export function listPackages() {
  session.call('listPackages.installer.repo.dappnode.eth', []).then(
    function (res) {
      let resParsed = JSON.parse(res)
      console.log('Listing packages ',resParsed)
      AppActions.updatePackageList(resParsed.result);
    }
  );
};

export function listDirectory() {
  // [ { name: 'rinkeby.dnp.dappnode.eth',
  //   status: 'Preparing',
  //   versions: [ '0.0.1', '0.0.2' ] },
  session.call('listDirectory.installer.repo.dappnode.eth', []).then(
    function (res) {
      let resParsed = JSON.parse(res)
      console.log('Listing directory ',resParsed)
      AppActions.updateDirectory(resParsed.result);
    }
  );
};
