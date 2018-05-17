import dispatcher from "../dispatcher";
import AppStore from 'Store';

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
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_PACKAGE_LIST,
    packageList: packageList
  });
}

export function updateDirectory(directory) {
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
    logs,
  });
}

export function updatePackageInfo(id, info) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_PACKAGE_INFO,
    id,
    info,
  });
}

export function updateChainStatus(status) {
  dispatcher.dispatch({
    type: AppStore.tag.UPDATE_CHAINSTATUS,
    status: status
  });
}

export function deleteTodo(id) {
  dispatcher.dispatch({
    type: "DELETE_TODO",
    id,
  });
}

export function reloadTodos() {
  // axios("http://someurl.com/somedataendpoint").then((data) => {
  //   console.log("got the data!", data);
  // })
  dispatcher.dispatch({type: "FETCH_TODOS"});
  setTimeout(() => {
    dispatcher.dispatch({type: "RECEIVE_TODOS", todos: [
      {
        id: 8484848484,
        text: "Go Shopping Again",
        complete: false
      },
      {
        id: 6262627272,
        text: "Hug Wife",
        complete: true
      },
    ]});
  }, 1000);
}
