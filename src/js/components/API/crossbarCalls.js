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

  const credentials = await getCredentials('admin')
  console.log('Successfully fetched credentials for: '+credentials.id)
  const onchallenge = createOnchallenge(credentials.key)

  const autobahnUrl = url
  const autobahnRealm = realm
  const connection = new autobahn.Connection({
    url: autobahnUrl,
    realm: autobahnRealm,
    authmethods: ["wampcra"],
    authid: credentials.id,
    onchallenge: onchallenge
  })

  connection.onopen = function (_session) {
    session = _session;
    console.log("CONNECTED to DAppnode's WAMP "+
      "\n   url "+autobahnUrl+
      "\n   realm: "+autobahnRealm)

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
}


///////////////////////////////
// Connection helper functions


async function getCredentials(type) {

  let url, id
  switch (type) {
    case 'core':
      url = 'http://my.wamp.dnp.dappnode.eth:8080/core'
      id = 'coredappnode'
      break
    case 'admin':
      url = 'http://my.wamp.dnp.dappnode.eth:8080/admin'
      id = 'dappnodeadmin'
      break
    default:
      throw Error('Unkown user type')
  }

  const res = await fetch(url, {
    method: 'POST',
    body: '{"procedure": "authenticate.wamp.dnp.dappnode.eth", "args": [{},{},{}]}',
    headers: { 'Content-Type': 'application/json' }
  })

  const resParsed = await res.json()
  const key = resParsed.args[0]
  return {
    id,
    key
  }
}

var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("POST", "demo_post2.asp", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("fname=Henry&lname=Ford");

function createOnchallenge(key) {

  return function(session, method, extra) {
    console.log("onchallenge", method, extra);
    if (method === "wampcra") {
       console.log("authenticating via '" + method + "' and challenge '" + extra.challenge + "'");
       return autobahn.auth_cra.sign(key, extra.challenge);
    } else {
       throw "don't know how to authenticate using '" + method + "'";
    }
  }
}




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
function handleRPCResponse(res) {

  let resParsed = JSON.parse(res)
  console.log('handlePackageResponse: ',resParsed)
  // resParsed = {
  //   success: true / false,
  //   message: "String"
  //   result: [optional]
  // }

  AppActions.updateLog({
    component: 'installer',
    topic: 'RPC CALL',
    msg:  resParsed.message,
    type: resParsed.success ? "success" : "error"
  });

  listPackages();

}

export function addPackage(link, envs) {

  console.log('Adding package, link: ',link);
  AppActions.updateLog({
    component: 'installer',
    topic: 'RPC CALL',
    msg:  'Adding package ' + link,
  });

  session
    .call('installPackage.installer.dnp.dappnode.eth', [link, JSON.stringify(envs)])
    .then(handleRPCResponse);
};

export function removePackage(id) {

  console.log('Removing package, id: ',id)
  AppActions.updateLog({
    component: 'installer',
    topic: 'RPC CALL',
    msg:  'Removing package... ',
  });

  session
    .call('removePackage.installer.dnp.dappnode.eth', [id])
    .then(handleRPCResponse);
};

export function togglePackage(id) {

  console.log('Toggling package, id: ',id)
  AppActions.updateLog({
    component: 'installer',
    topic: 'RPC CALL',
    msg:  'Toggling package... ',
  });

  session
    .call('togglePackage.installer.dnp.dappnode.eth', [id])
    .then(handleRPCResponse);
};

export function updatePackageEnv(id, envs) {

  console.log('Updating package envs, id: ',id,' envs: ',envs)

  session
    .call('updatePackageEnv.installer.dnp.dappnode.eth', [id, JSON.stringify(envs)])
    .then(handleRPCResponse)
};

export function logPackage(id) {

  console.log('Logging package, id: ',id)

  session.call('logPackage.installer.dnp.dappnode.eth', [id]).then(
    function (res) {
      let resParsed = JSON.parse(res)
      AppActions.updatePackageLog(id, resParsed.result)
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
