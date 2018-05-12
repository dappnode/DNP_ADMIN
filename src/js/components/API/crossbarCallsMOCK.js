import autobahn from 'autobahn';
import * as AppActions from 'Action';
import AppStore from 'Store';

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function initialFetch() {
  let deviceList = [];
  for (let i = 0; i < 3; i++) {
    deviceList.push({
      name: 'device_'+i,
      ID: makeid(),
      OTP: makeid()
    })
  }
  AppActions.updateDeviceList(deviceList);
}

initialFetch();

export function addDevice(name) {

  let ID1 = makeid();
  let ID2 = makeid();
  setTimeout(function(){
    let device = {
      name: name,
      ID: ID1,
      OTP: ID2
    };
    console.log('Adding device, ',device);
    AppActions.addDevice(device);
  }, 300);
};

export function removeDevice(ID) {
  console.log('Removing device, id: ',ID)
  let deviceList = AppStore.getDeviceList();
  for (let i = 0; i < deviceList.length; i++) {
    if (deviceList[i].ID == ID) {
      deviceList.splice(i, 1);
    }
  }
  setTimeout(function(){
    AppActions.updateDeviceList(deviceList);
  }, 300);
};

export function listDevices() {
  console.log('Listing devices')
  let deviceList = AppStore.getDeviceList();
  setTimeout(function(){
    AppActions.updateDeviceList(deviceList);
  }, 300);

};
