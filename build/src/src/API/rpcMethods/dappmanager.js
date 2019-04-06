/**
 * DAPPMANAGER WAMP RPC METHODS
 * This file describes the available RPC methods of the DAPPMANAGER module
 * It serves as documentation and as a mechanism to quickly add new calls
 *
 * Each key of this object is the last subdomain of the entire event:
 *   event = "installPackage.dappmanager.dnp.dappnode.eth"
 *   object key = "installPackage"
 */

export default {
  /**
   * [ping]
   * Default method to check if app is alive
   *
   * @returns {object} Returns version data. #### TODO split into another call
   * result: {
   *   version: "0.1.21",
   *   branch: "master",
   *   commit: "ab991e1482b44065ee4d6f38741bd89aeaeb3cec"
   * }
   */
  ping: {},

  /**
   * [installPackage]
   * Installs a package. It resolves dependencies, downloads
   * manifests and images, loads the images to docker, and calls
   * docker up on each package.
   * It has extra functionality for special cases
   * - allowCore: If a manifest requests a package to be core
   *   it will only be granted if
   *   1. Its manifest comes from APM and .dnp.dappnode.eth
   *   2. It comes from IPFS and the BYPASS_CORE_RESTRICTION env is true
   * - Special versions: It needs to deal with two cases
   *   1. ver = "latest"
   *   2. ver = "/ipfs/QmZ87fb2..."
   *
   * @param {string} id DNP .eth name
   * @param {object} userSetEnvs
   * userSetEnvs= {
   *   "kovan.dnp.dappnode.eth": {
   *     "ENV_NAME": "VALUE1"
   * }, ... }
   * @param {object} userSetVols user set volumes
   * userSetVols = {
   *   "kovan.dnp.dappnode.eth": {
   *     "kovan:/root/.local/share/io.parity.ethereum/": "different_name"
   * }, ... }
   * @param {object} userSetPorts user set ports
   * userSetPorts = {
   *   "kovan.dnp.dappnode.eth": {
   *     "30303": "31313:30303",
   *     "30303/udp": "31313:30303/udp"
   * }, ... }
   * @param {object} options install options
   * - BYPASS_RESOLVER {Bool}: Skips dappGet and just fetches
   *   first level dependencies
   * options = { BYPASS_RESOLVER: true }
   */
  installPackage: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [installPackageSafe]
   * Installs a package in safe mode, by setting options.BYPASS_RESOLVER = true
   *
   * @param {string} id DNP .eth name
   */
  installPackageSafe: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [removePackage]
   * Remove package data: docker down + disk files
   *
   * @param {string} id DNP .eth name
   * @param {Bool} deleteVolumes flag to also clear permanent package data
   */
  removePackage: {
    manadatoryKwargs: ["id", "deleteVolumes"]
  },

  /**
   * [togglePackage]
   * Stops or starts after fetching its status
   *
   * @param {string} id DNP .eth name
   * @param {number} timeout seconds to stop the package
   */
  togglePackage: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [restartPackage]
   * Calls docker rm and docker up on a package
   *
   * @param {string} id DNP .eth name
   */
  restartPackage: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [restartPackageVolumes]
   * Removes a package volumes. The re-ups the package
   *
   * @param {string} id DNP .eth name
   */
  restartPackageVolumes: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [updatePackageEnv]
   * Updates the .env file of a package. If requested, also re-ups it
   *
   * @param {string} id DNP .eth name
   * @param {object} envs environment variables
   * envs = {
   *   ENV_NAME: ENV_VALUE
   * }
   * @param {Bool} restart flag to restart the DNP
   */
  updatePackageEnv: {
    manadatoryKwargs: ["id", "envs", "restart"]
  },

  /**
   * [logPackage]
   * @param {string} id DNP .eth name
   * @param {object} options log options
   * - timestamp {Bool}: Show timestamps
   * - tail {number}: Number of lines to return from bottom
   * options = { timestamp: true, tail: 200 }
   * @returns {object} result = {
   *   id: dnpName
   *   logs: <string with escape codes>
   * }
   */
  logPackage: {
    manadatoryKwargs: ["id", "options"]
  },

  /**
   * [managePorts]
   * Open or closes requested ports
   *
   * @param {string} action: "open" or "close" (string)
   * @param {array} ports: array of port objects
   * ports = [ { number: 30303, type: TCP }, ... ]
   */
  managePorts: {
    manadatoryKwargs: ["ports", "action"]
  },

  /**
   * [getUserActionLogs]
   * Returns the user action logs. This logs are stored in a different
   * file and format, and are meant to ease user support
   *
   * @param {number} fromLog, default value = 0
   * @param {number} numLogs, default value = 50
   * @returns {string} logs, stringified JSON concatenated by "\n"
   * To parse, by newline and then parse each line individually.
   * Each resulting object, log = {
   *   event: "installPackage.dappmanager.dnp.dappnode.eth",
   *   kwargs: { id: "rinkeby.dnp.dappnode.eth", ... },
   *   level: "error",
   *   message: "Timeout to cancel expired",
   *   name: "Error",
   *   stack: "Error: Timeout to cancel expired↵  ...",
   *   timestamp: "2019-02-01T19:09:16.503Z"
   * }
   */
  getUserActionLogs: {},

  /**
   * [fetchPackageVersions]
   * Fetches all available version manifests from a package APM repo
   *
   * @param {string} id DNP .eth name
   * @returns {array} dnpsWithVersions = [{
   *   version: "0.0.4", {string}
   *   manifest: <Manifest object> {object}
   * }, ... ]
   */
  fetchPackageVersions: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [listPackages]
   * Returns the list of current containers associated to packages
   *
   * @returns {array} dnpInstalled = [{
   *   id: "927623894...", {string}
   *   isDNP: true, {Boolean}
   *   created: <Date string>,
   *   image: <Image Name>, {string}
   *   name: otpweb.dnp.dappnode.eth, {string}
   *   shortName: otpweb, {string}
   *   version: "0.0.4", {string}
   *   ports: <list of ports>, {string}
   *   state: "exited", {string}
   *   running: true, {Boolean}
   *   ...
   *   envs: <Env variables> {object}
   * }]
   */
  listPackages: {},

  /**
   * [fetchDirectory]
   * Fetches all package names in the custom dappnode directory.
   * This feature helps the ADMIN UI load the directory data faster.
   *
   * @returns {object} dnpDirectory = [{
   *   name: packageName, {string}
   *   status: "Preparing", {string}
   *   currentVersion: "0.1.2" or null, {string}
   * }, ... ]
   */
  fetchDirectory: {},

  /**
   * [fetchPackageData]
   * Fetches the manifest of the latest version and its avatar.
   *
   * @param {string} id DNP .eth name
   * @returns {object} result = {
   *   avatar: "data:image/png;base64..." {string},
   *   manifest: <manifest object> {object}
   * }
   */
  fetchPackageData: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [resolveRequest]
   * Resolves a DNP request given the current repo state fetched
   * from the blockchain and the current installed DNPs versions
   *
   * @param {object} req, DNP request to resolve
   * req = {
   *   name: "otpweb.dnp.dappnode.eth", {string}
   *   ver: "0.1.4" {string}
   * }
   * @returns {object} result,
   * - On success: result = {
   *     success: {"bind.dnp.dappnode.eth": "0.1.4"},
   *     alreadyUpdated: {"bind.dnp.dappnode.eth": "0.1.2"},
   *     message: "Found compatible state with case 1/256",
   *   }
   * - On error: result = {
   *     success: false,
   *     message: "Could not find a compatible state.
   *       Packages x.dnp.dappnode.eth request incompatible versions of y.dnp.dappnode.eth.
   *       Checked 256/256 possible states."
   *   }
   */
  resolveRequest: {
    manadatoryKwargs: ["req"]
  },

  /**
   * [diskSpaceAvailable]
   *
   * [DEPRECATED]
   */
  diskSpaceAvailable: {
    manadatoryKwargs: ["path"]
  },

  /**
   * [getStats]
   * Computes the current usage % of cpu, memory and disk
   *
   * @returns {Object} status = {
   *   cpu: "35%", {string}
   *   memory: "46%", {string}
   *   disk: "57%", {string}
   * }
   */
  getStats: {},

  /**
   * [requestChainData]
   * Requests chain data. Also instructs the DAPPMANAGER
   * to keep sending data for a period of time (5 minutes)
   */
  requestChainData: {},

  /**
   * [notificationsGet]
   * Returns not viewed notifications
   *
   * @returns {Object} notifications object, by notification id
   * notifications = {
   *   "diskSpaceRanOut-stoppedPackages": {
   *     id: "diskSpaceRanOut-stoppedPackages",
   *     type: "danger",
   *     title: "Disk space ran out, stopped packages",
   *     body: "Available disk space is less than a safe ...",
   *   }
   * }
   */
  notificationsGet: {},

  /**
   * [notificationsRemove]
   * Marks notifications as view by deleting them from the db
   *
   * @param {Array} ids Array of ids to be marked as read
   * ids = [ "notification-id1", "notification-id2" ]
   */
  notificationsRemove: {
    manadatoryKwargs: ["ids"]
  },

  /**
   * [diagnose]
   * Returns a list of checks done as a diagnose
   *
   * @returns {Object} diagnoses object, by diagnose id
   * diagnoses = {
   *   "dockerVersion": {
   *     name: "docker version",
   *     result: "Docker version 18.06.1-ce, build e68fc7a"
   *       <or>
   *     error: "sh: docker: not found"
   *   }
   * }
   */
  diagnose: {},

  /**
   * [copyFileTo]
   * @param {string} id DNP .eth name
   * @param {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
   * @param {string} toPath = "/usr/src/app/config.json"
   */
  copyFileTo: {
    manadatoryKwargs: ["id", "dataUri", "toPath"]
  },

  /**
   * [copyFileFrom]
   * @param {string} id DNP .eth name
   * @param {string} fromPath = "/usr/src/app/config.json"
   * @returns {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
   */
  copyFileFrom: {
    manadatoryKwargs: ["id", "fromPath"]
  }
};
