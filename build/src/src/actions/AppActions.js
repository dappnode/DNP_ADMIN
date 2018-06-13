import dispatcher from "../dispatcher";
import AppStore from "stores/AppStore";

export function updateDeviceList(deviceList) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_DEVICE_LIST,
    deviceList: deviceList
  });
}

export function addDevice(device) {
  dispatcher.dispatch({
    type: AppStore.tag.ADD_DEVICE,
    device: device
  });
}

export function updatePackageList(packageList) {
  console.log("Updating packageList ", packageList);
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_PACKAGE_LIST,
    packageList: packageList
  });
}

export function updateDirectory(directory) {
  console.log("Updating directory ", directory);
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_DIRECTORY,
    directory: directory
  });
}

export function addPackage(_package) {
  dispatcher.dispatch({
    type: AppStore.tag.ADD_DEVICE,
    package: _package
  });
}

export function updateLogMessage(logMessage) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_LOGMESSAGE,
    logMessage: logMessage
  });
}

export function updateLog(log) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_LOG,
    log: log
  });
}

export function updateProgressLog(log) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_PROGRESSLOG,
    log: log
  });
}

export function updatePackageLog(id, logs) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_PACKAGE_LOG,
    id,
    logs
  });
}

export function updatePackageInfo(id, info) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_PACKAGE_INFO,
    id,
    info
  });
}

export function updateChainStatus(status) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_CHAINSTATUS,
    status: status
  });
}

export function updateStatus(payload) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_STATUS,
    payload
  });
}

export function updateDisabled(payload) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_DISABLED,
    payload
  });
}

export function updatePackageData(payload) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_PACKAGEDATA,
    payload
  });
}
