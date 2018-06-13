import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class AppStore extends EventEmitter {
  constructor() {
    super();
    this.deviceList = [];
    this.packageList = [];
    this.directory = [];
    this.packageLog = {};
    this.packageInfo = {};
    this.logMessage = { success: true, msg: "" };
    this.log = {};
    this.progressLog = {};
    this.chainStatus = {};
    this.status = {};
    this.disabled = {};
    this.packages = {};
    // The log object is
    // log[component][topic] = {msg: 'Package installed', type: 'success'}
    // messages for the same component and topic get overwritten
    // when a RPC returns something to a component, all topics are erased
    // when a RPC is sent, all topics are erased

    this.tag = {
      UPDATE_DEVICE_LIST: "UPDATE_DEVICE_LIST",
      UPDATE_PACKAGE_LIST: "UPDATE_PACKAGE_LIST",
      UPDATE_DIRECTORY: "UPDATE_DIRECTORY",
      UPDATE_LOGMESSAGE: "UPDATE_LOGMESSAGE",
      UPDATE_LOG: "UPDATE_LOG",
      UPDATE_PROGRESSLOG: "UPDATE_PROGRESSLOG",
      UPDATE_PACKAGE_LOG: "UPDATE_PACKAGE_LOG",
      UPDATE_PACKAGE_INFO: "UPDATE_PACKAGE_INFO",
      UPDATE_CHAINSTATUS: "UPDATE_CHAINSTATUS",
      UPDATE_STATUS: "UPDATE_STATUS",
      UPDATE_DISABLED: "UPDATE_DISABLED",
      UPDATE_PACKAGEDATA: "UPDATE_PACKAGEDATA",
      ADD_DEVICE: "ADD_DEVICE",
      CHANGE: "CHANGE",
      CHANGE_CHAINSTATUS: "CHANGE_CHAINSTATUS",
      CHANGE_STATUS: "CHANGE_STATUS",
      CHANGE_PROGRESSLOG: "CHANGE_PROGRESSLOG"
    };
  }

  getDeviceList() {
    return this.deviceList;
  }

  getPackageList() {
    return this.packageList;
  }

  getDirectory() {
    return this.directory;
  }

  getPackageLog() {
    return this.packageLog;
  }

  getPackageInfo() {
    return this.packageInfo;
  }

  getLogMessage() {
    return this.logMessage;
  }

  getLog(component) {
    return this.log[component] || {};
  }

  getProgressLog() {
    return this.progressLog;
  }

  getChainStatus() {
    return this.chainStatus || {};
  }

  getStatus() {
    return this.status || {};
  }

  getDisabled() {
    return this.disabled || {};
  }

  getPackages() {
    return this.packages;
  }

  handleActions(action) {
    switch (action.type) {
      case this.tag.UPDATE_DEVICE_LIST: {
        this.deviceList = action.deviceList;
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_PACKAGE_LIST: {
        this.packageList = action.packageList;
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_DIRECTORY: {
        this.directory = action.directory;
        action.directory.forEach(pkg => {
          this.disabled[pkg.name] = pkg.disableInstall;
        });
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.ADD_DEVICE: {
        this.deviceList.push(action.device);
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_PACKAGE_LOG: {
        this.packageLog[action.id] = action.logs;
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_PACKAGE_INFO: {
        this.packageInfo[action.id] = action.info;
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_LOGMESSAGE: {
        this.logMessage = action.logMessage;
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_LOG: {
        if (!(action.log.component in this.log)) {
          this.log[action.log.component] = {};
        }
        if (action.log.topic === "RPC CALL") {
          this.log[action.log.component] = {};
        }
        this.log[action.log.component][action.log.topic] = {
          msg: action.log.msg,
          type: action.log.type
        };
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_PROGRESSLOG: {
        // action.log = data (object), the object may contain
        // pkg: PACKAGE_NAME
        // clear: true
        // msg: 'download'
        // order: [packageName1, ...]
        const log = action.log;
        if (log.clear) {
          this.progressLog = { msg: {}, order: [] };
        }
        if (log.order) {
          log.order.forEach((name, i) => {
            this.progressLog.order.push(name);
          });
        }
        if (log.pkg) {
          this.progressLog.msg[log.pkg] = log.msg;
        }
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_CHAINSTATUS: {
        this.chainStatus = action.status;
        this.emit(this.tag.CHANGE_CHAINSTATUS);
        break;
      }
      case this.tag.UPDATE_STATUS: {
        let status = action.payload;
        // action = { pkg: 'dappmanager', item: 'crossbar', on: true, msg: 'works' }
        if (!("pkg" in status && "item" in status))
          throw Error(
            "UPDATE STATUS object is not correctly constructed: ",
            status
          );
        // Initialize objects
        if (!this.status[status.pkg]) this.status[status.pkg] = {};
        if (!this.status[status.pkg][status.item])
          this.status[status.pkg][status.item] = {};
        // store info
        this.status[status.pkg][status.item] = status;
        this.emit(this.tag.CHANGE_STATUS);
        break;
      }
      case this.tag.UPDATE_DISABLED: {
        this.disabled[action.payload.name] = action.payload.disabled;
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_PACKAGEDATA: {
        // Initialize object
        const id = action.payload.name;
        // update package data or initialize if non-existent
        this.packages[id] = Object.assign(
          this.packages[id] || {},
          action.payload.data
        );
        this.emit(this.tag.CHANGE);
        break;
      }
      default: {
        console.error("STORE DEFAULT CASE");
      }
    }
  }
}

const appStore = new AppStore();
dispatcher.register(appStore.handleActions.bind(appStore));

export default appStore;
