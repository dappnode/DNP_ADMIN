import autobahn from 'autobahn';
import * as AppActions from 'Action';
import AppStore from 'Store';

// let url = 'ws://localhost:8080/ws';
// let url = 'ws://206.189.162.209:8080/ws';
// Produccion
let url = 'ws://my.wamp.dnp.dappnode.eth:8080/ws';

let connection = new autobahn.Connection({url: url, realm: 'realm1'});
let session;
connection.onopen = function (_session) {
  session = _session;
  listDevices();
  listPackages();
  listDirectory();

  session.subscribe("log.installer.repo.dappnode.eth", function(res){
    let log = res[0];
    AppActions.updateLog({
      component: 'installer',
      topic: log.topic,
      msg: log.msg,
      type: log.type
    });
  });
}

connection.open();


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
      console.log('Adding device RES',res)
      handleResponseMessage(res, 'Device successfully added');
    }
  );
};

export function removeDevice(deviceName) {
  console.log('Removing device, id: ',deviceName)
  session.call('removeDevice.vpn.repo.dappnode.eth', [deviceName]).then(
    function (res) {
      console.log('Removing device RES',res)
      handleResponseMessage(res, 'Device successfully removed')
      listDevices();
    }
  );
};

export function listDevices() {
  console.log('Listing devices')
  session.call('listDevices.vpn.repo.dappnode.eth', []).then(
    function (res) {
      console.log('Listing devices RES ',res)
      AppActions.updateDeviceList(res.devices);
    }
  );
};

/* PACKAGE */
function handlePackageResponse(res) {

  let resParsed = JSON.parse(res)
  console.log('handlePackageResponse: ',resParsed)
  // resParsed = {
  //   success: true / false,
  //   msg: "String"
  // }

  AppActions.updateLog({
    component: 'installer',
    topic: 'RPC CALL',
    msg:  resParsed.message,
    type: resParsed.success ? "success" : "error"
  });

  listPackages();

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
    .then(handlePackageResponse);
};

export function removePackage(id) {
  console.log('Removing package, id: ',id)
  session.call('removePackage.installer.repo.dappnode.eth', [id]).then(
    function (res) {
      console.log('RECEIVED RES after removing ',res)
      // handleResponseMessage(res, 'Package successfully removed')
      listPackages();
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
