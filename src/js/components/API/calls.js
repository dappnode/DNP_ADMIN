import autobahn from 'autobahn';
import * as AppActions from 'Action';
import AppStore from 'Store';

// let url = 'ws://localhost:8080/ws';
// let url = 'ws://206.189.162.209:8080/ws';
// Produccion
const url = 'ws://my.wamp.dnp.dappnode.eth:8080/ws'
const realm = 'dappnode_admin'

const callTags = {
  // // Device manager
  // addDevice: 'addDevice.vpn.repo.dappnode.eth',
  // removeDevice: 'removeDevice.vpn.repo.dappnode.eth',
  // listDevices: 'listDevices.vpn.repo.dappnode.eth',
  // Package manager
  installPackage: 'installPackage.installer.dnp.dappnode.eth',
  removePackage: 'removePackage.installer.dnp.dappnode.eth',
  togglePackage: 'togglePackage.installer.dnp.dappnode.eth',
  updatePackageEnv: 'updatePackageEnv.installer.dnp.dappnode.eth',
  logPackage: 'logPackage.installer.dnp.dappnode.eth',
  fetchPackageInfo: 'fetchPackageInfo.installer.dnp.dappnode.eth',
  listPackages: 'listPackages.installer.repo.dappnode.eth',
  listDirectory: 'listDirectory.installer.repo.dappnode.eth'
}

const handlers = {
  // // Device manager
  // addDevice: displayResponseInComponent('devices'),
  // removeDevice: displayResponseInComponent('devices'),
  // listDevices: storeResultConsoleLogErrors(AppActions.updateDeviceList),
  // Package manager
  installPackage: displayResponseInComponentAndReload('installer'),
  removePackage: displayResponseInComponentAndReload('package'),
  togglePackage: displayResponseInComponentAndReload('package'),
  updatePackageEnv: displayResponseInComponentAndReload('package'),
  logPackage: storeResultConsoleLogErrors(AppActions.updatePackageLog),
  fetchPackageInfo: storeResultConsoleLogErrors(AppActions.updatePackageInfo),
  listPackages: storeResultConsoleLogErrors(AppActions.updatePackageList),
  listDirectory: storeResultConsoleLogErrors(AppActions.updateDirectory)
}

let installPackage
let removePackage
let togglePackage
let updatePackageEnv
let logPackage
let fetchPackageInfo
let listPackages
let listDirectory

// Define internal calls, this are only called automatically

// Initalize app
let session // make this variable global

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

  listPackages =     call(_session, 'listPackages')
  listDirectory =    call(_session, 'listDirectory')
  installPackage =   call(_session, 'installPackage')
  removePackage =    call(_session, 'removePackage')
  togglePackage =    call(_session, 'togglePackage')
  updatePackageEnv = call(_session, 'updatePackageEnv')
  logPackage =       call(_session, 'logPackage')
  fetchPackageInfo = call(_session, 'fetchPackageInfo')

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


function call(session, tag) {
  console.log('CONSTRUCTING ' + tag)
  return session.call(callTags[tag], args = [])
    .then(res => JSON.parse(res))
    .then(handler[tag])
    .then(() => {

    })
}


function displayResponseInComponentAndReload(component) {
  return (res) => {
    AppActions.updateLog({
      component,
      msg:  res.message,
      type: res.success ? "success" : "error"
    })
    const listPackages =  call(session, 'listPackages')
    listPackages()
  }
}


function storeResultConsoleLogErrors(action) {
  return (res) => {
    if (res.success) console.error(res.message)
    else console.log(res) // ##### For development only
    action(res.result)
  }
}


module.exports = {
  // Device manager
  // Package manager
  installPackage,
  removePackage,
  togglePackage,
  updatePackageEnv,
  logPackage,
  fetchPackageInfo
}
