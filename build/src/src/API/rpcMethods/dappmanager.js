// DAPPMANAGER WAMP RPC METHODS
// This file describes the available RPC methods of the DAPPMANAGER module
// It serves as documentation and as a mechanism to quickly add new calls
//
// Each key of this object is the last subdomain of the entire event:
//   event = "installPackage.dappmanager.dnp.dappnode.eth"
//   Object key = "installPackage"

export default {
  // installPackage
  // > kwargs: { id }
  // > result: {}
  installPackage: {
    manadatoryKwargs: ["id"]
  },

  // installPackageSafe
  // > kwargs: { id }
  // > result: {}
  installPackageSafe: {
    manadatoryKwargs: ["id"]
  },

  // removePackage:
  // > kwargs: { id, deleteVolumes }
  // > result: {}
  removePackage: {
    manadatoryKwargs: ["id", "deleteVolumes"]
  },

  // togglePackage:
  // > kwargs: { id, timeout }
  // > result: {}
  togglePackage: {
    manadatoryKwargs: ["id"]
  },

  // restartPackage:
  // > kwargs: { id }
  // > result: {}
  restartPackage: {
    manadatoryKwargs: ["id"]
  },

  // restartPackageVolumes:
  // > kwargs: { id, deleteVolumes }
  // > result: {}
  restartPackageVolumes: {
    manadatoryKwargs: ["id"]
  },

  // updatePackageEnv:
  // > kwargs: { id, envs, restart, isCORE }
  // > result: {}
  updatePackageEnv: {
    manadatoryKwargs: ["id", "envs", "restart"]
  },

  // logPackage:
  // > kwargs: { id, options }
  // > result: { id, logs = <string> }
  logPackage: {
    manadatoryKwargs: ["id", "options"]
  },

  // managePorts:
  // > kwargs: { ports, logId }
  // > result: {}
  managePorts: {
    manadatoryKwargs: ["ports", "action"]
  },

  // getUserActionLogs:
  // > kwargs: {}
  // > result: logs = <string>
  getUserActionLogs: {},

  // fetchPackageVersions:
  // > kwargs: { id }
  // > result: [{
  //     version: '0.0.4', (string)
  //     manifest: <Manifest> (object)
  //   },
  //   ...]
  fetchPackageVersions: {
    manadatoryKwargs: ["id"]
  },

  // listPackages:
  // > kwargs: {}
  // > result: [{
  //     id: '927623894...', (string)
  //     isDNP: true, (boolean)
  //     created: <Date string>,
  //     image: <Image Name>, (string)
  //     name: otpweb.dnp.dappnode.eth, (string)
  //     shortName: otpweb, (string)
  //     version: '0.0.4', (string)
  //     ports: <list of ports>, (string)
  //     state: 'exited', (string)
  //     running: true, (boolean)
  //     ...
  //     envs: <Env variables> (object)
  //   },
  //   ...]
  listPackages: {},

  // fetchDirectory:
  // > kwargs: {}
  // > result: [{
  //     name,
  //     status
  //   },
  //   ...]
  fetchDirectory: {},

  // getPackageData:
  // > kwargs: { id }
  // > result: {
  //     manifest,
  //     avatar
  //   }
  fetchPackageData: {
    manadatoryKwargs: ["id"]
  },

  // resolveRequest:
  // > kwargs: { req }
  // > result: [{
  //     success,
  //     errors,
  //     state,
  //     casesChecked,
  //     totalCases,
  //     hasTimedOut,
  //   },
  //   ...]
  resolveRequest: {
    manadatoryKwargs: ["req"]
  },

  // diskSpaceAvailable:
  // > kwargs: { path }
  // > result: {
  //       exists: <Bool>
  //       totalSize: <String> 340G
  //       availableSize: <String> 219G
  //   }
  diskSpaceAvailable: {
    manadatoryKwargs: ["path"]
  },

  // getStats:
  // > kwargs: { path }
  // > result: status =
  //   {
  //       cpu, <String>
  //       memory, <String>
  //       disk, <String>
  //   }
  getStats: {},

  // requestChainData:
  // > kwargs: {}
  // > result: {}
  requestChainData: {},

  // notificationsGet:
  // > kwargs: { path }
  // > result: notifications =
  //   {
  //       "notificiation-id": {
  //          id: 'diskSpaceRanOut-stoppedPackages',
  //          type: 'error',
  //          title: 'Disk space ran out, stopped packages',
  //          body: `Available disk space is less than a safe ...`,
  //       },
  //       ...
  //   }
  notificationsGet: {},

  // notificationsRemove:
  // > kwargs: { ids }
  //   ids = [ "notification-id1", "notification-id2" ]
  // > result: {}
  notificationsRemove: {
    manadatoryKwargs: ["ids"]
  },

  // diagnose:
  // > kwargs: { }
  // > result: diagnose =
  //   {
  //     dockerVersion: {
  //       name: 'docker version',
  //       result: 'Docker version 18.06.1-ce, build e68fc7a' <or>
  //       error: 'sh: docker: not found'
  //     },
  //     ...
  //   }
  diagnose: {},

  // copyFileTo:
  // > kwargs: {
  //     id: "mydnp.dnp.dappnode.eth",
  //     dataUri: "data:application/zip;base64,UEsDBBQAAAg..."
  //     toPath: "/usr/src/app/config.json"
  //   }
  // > result: {}
  copyFileTo: {
    manadatoryKwargs: ["id", "dataUri", "toPath"]
  },

  // copyFileTo:
  // > kwargs: {
  //     id: "mydnp.dnp.dappnode.eth",
  //     fromPath: "/usr/src/app/config.json"
  //   }
  // > result: data Uri: "data:application/zip;base64,UEsDBBQAAAg..."
  copyFileFrom: {
    manadatoryKwargs: ["id", "fromPath"]
  }
};
