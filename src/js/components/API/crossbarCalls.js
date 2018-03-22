import autobahn from 'autobahn';
import * as AppActions from 'Action';
import AppStore from 'Store';

let url = 'ws://localhost:8080/ws';

let connection = new autobahn.Connection({url: url, realm: 'realm1'});
let session;
connection.onopen = function (_session) {
  session = _session;
  listDevices();
  listPackages();
}
connection.open();

let handleResponseMessage = function(res, successMessage) {
  if (res.result == 'OK'){
    AppActions.updateLogMessage(successMessage);
  } else if (res.result == 'ERR'){
    AppActions.updateLogMessage('ERROR: '+res.resultStr);
  } else {
    AppActions.updateLogMessage('UNKOWN ERROR!, showing full server response '+JSON.stringify(res));
  }
}

/* DEVICE CALLS */

export function addDevice(name) {
  console.log('Adding device, name: ',name);
  session.call('addDevice.vpn.repo.dappnode.eth', [name]).then(
    function (res) {
      handleResponseMessage(res, 'Device successfully added');
      listDevices();
    }
  );
};

export function removeDevice(id) {
  console.log('Removing device, id: ',id)
  session.call('removeDevice.vpn.repo.dappnode.eth', [id]).then(
    function (res) {
      handleResponseMessage(res, 'Device successfully removed')
      listDevices();
    }
  );
};

export function listDevices() {
  console.log('Listing devices')
  session.call('listDevices.vpn.repo.dappnode.eth', []).then(
    function (res) {
      AppActions.updateDeviceList(res.devices);
    }
  );
};

/* PACKAGE */

export function addPackage(link) {
  console.log('Adding package, link: ',link);
  session.call('addPackage.vpn.repo.dappnode.eth', [link]).then(
    function (res) {
      handleResponseMessage(res, 'Package successfully added');
      listPackages();
    }
  );
};

export function removePackage(id) {
  console.log('Removing package, id: ',id)
  session.call('removePackage.vpn.repo.dappnode.eth', [id]).then(
    function (res) {
      handleResponseMessage(res, 'Package successfully removed')
      listPackages();
    }
  );
};

export function listPackages() {
  session.call('listPackages.vpn.repo.dappnode.eth', []).then(
    function (res) {
      console.log('Listing packages ',res)
      AppActions.updatePackageList(res.packages);
    }
  );
};
