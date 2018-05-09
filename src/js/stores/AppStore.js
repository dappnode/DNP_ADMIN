import { EventEmitter } from 'events';

import dispatcher from '../dispatcher';

class AppStore extends EventEmitter {
  constructor() {
    super()
    this.deviceList = [];
    this.packageList = [];
    this.directory = [];
    this.logMessage = {success: true, msg: ''};
    this.log = {};
    this.chainStatus = {}
    // The log object is
    // log[component][topic] = {msg: 'Package installed', type: 'success'}
    // messages for the same component and topic get overwritten
    // when a RPC returns something to a component, all topics are erased
    // when a RPC is sent, all topics are erased

    this.tag = {
      UPDATE_DEVICE_LIST: 'UPDATE_DEVICE_LIST',
      UPDATE_PACKAGE_LIST: 'UPDATE_PACKAGE_LIST',
      UPDATE_DIRECTORY: 'UPDATE_DIRECTORY',
      UPDATE_LOGMESSAGE: 'UPDATE_LOGMESSAGE',
      UPDATE_LOG: 'UPDATE_LOG',
      UPDATE_CHAINSTATUS: 'UPDATE_CHAINSTATUS',
      ADD_DEVICE: 'ADD_DEVICE',
      CHANGE: 'CHANGE'
    }
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

  getLogMessage() {
    return this.logMessage;
  }

  getLog(component) {
    return this.log[component] || {};
  }

  getChainStatus() {
    return this.chainStatus || {};
  }

  handleActions(action) {
    switch(action.type) {
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
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.ADD_DEVICE: {
        this.deviceList.push(action.device)
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_LOGMESSAGE: {
        this.logMessage = action.logMessage
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_LOG: {
        if (!(action.log.component in this.log)) {
          this.log[action.log.component] = {}
        }
        if (action.log.topic == 'RPC CALL') {
          this.log[action.log.component] = {}
        }
        this.log[action.log.component][action.log.topic] = {
          msg: action.log.msg,
          type: action.log.type
        }
        this.emit(this.tag.CHANGE);
        break;
      }
      case this.tag.UPDATE_CHAINSTATUS: {
        this.chainStatus[action.status.name] = action.status
        this.emit(this.tag.CHANGE);
        break;
      }
    }
  }

}

const appStore = new AppStore;
dispatcher.register(appStore.handleActions.bind(appStore));

export default appStore;
