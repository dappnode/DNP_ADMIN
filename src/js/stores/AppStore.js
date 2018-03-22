import { EventEmitter } from 'events';

import dispatcher from '../dispatcher';

class AppStore extends EventEmitter {
  constructor() {
    super()
    this.deviceList = {};
    this.packageList = {};
    this.logMessage = '';

    this.tag = {
      UPDATE_DEVICE_LIST: 'UPDATE_DEVICE_LIST',
      UPDATE_PACKAGE_LIST: 'UPDATE_PACKAGE_LIST',
      UPDATE_LOGMESSAGE: 'UPDATE_LOGMESSAGE',
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

  getLogMessage() {
    return this.logMessage;
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
    }
  }

}

const appStore = new AppStore;
dispatcher.register(appStore.handleActions.bind(appStore));

export default appStore;
