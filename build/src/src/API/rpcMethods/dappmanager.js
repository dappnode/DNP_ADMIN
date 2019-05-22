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
   * @returns {*}
   */
  ping: {},

  // ##### TEMP
  /**
   * Cleans the cache files of the DAPPMANAGER:
   * - local DB
   * - user action logs
   * - temp transfer folder
   *
   * @param {string} containerName  "DAppNodePackage-ropsten.dnp.dappnode.eth"
   * @param {string} path
   * @param {bool} showAll Show hidden files
   * @returns {array} contents = [{
   *   isDirectory: false,
   *   permissions: "-rwxr-xr-x",
   *   numOfLinks: "2",
   *   ownerName: "root",
   *   ownerGroup: "root",
   *   size: "2745",
   *   month: "May",
   *   day: "9",
   *   time: "20:49",
   *   name: "Eth config.json"
   * }, ... ]
   */
  fileBrowser: {
    manadatoryKwargs: ["containerName", "path"]
  },

  /**
   * Gets a container's workingDir
   *
   * @param {string} containerName "DAppNodePackage-ropsten.dnp.dappnode.eth"
   * @returns {string} workingDir = "/usr/app/dnp"
   */
  getContainerWorkingDir: {
    manadatoryKwargs: ["containerName"]
  },

  /**
   * Does a backup of a DNP and sends it to the client for download.
   *
   * @param {string} id DNP .eth name
   * @param {array} backup [
   *   { name: "config", path: "/usr/.raiden/config" },
   *   { name: "keystore", path: "/usr/.raiden/secret/keystore" }
   * ]
   * @returns {string} fileId = "64020f6e8d2d02aa2324dab9cd68a8ccb186e192232814f79f35d4c2fbf2d1cc"
   */
  backupGet: {
    mandatoryKwargs: ["id", "backup"]
  },

  /**
   * Restore a previous backup of a DNP, from the dataUri provided by the user
   *
   * @param {string} id DNP .eth name
   * @param {string} fileId = "64020f6e8d2d02aa2324dab9cd68a8ccb186e192232814f79f35d4c2fbf2d1cc"
   * @param {array} backup [
   *   { name: "config", path: "/usr/.raiden/config" },
   *   { name: "keystore", path: "/usr/.raiden/secret/keystore" }
   * ]
   */
  backupRestore: {
    mandatoryKwargs: ["id", "backup", "fileId"]
  },

  /**
   * [changeIpfsTimeout]
   * Used to test different IPFS timeout parameters live from the ADMIN UI.
   *
   * @param {(string|number)} timeout new IPFS timeout in ms
   */
  changeIpfsTimeout: {
    mandatoryKwargs: ["timeout"]
  },

  /**
   * [cleanCache]
   * Cleans the cache files of the DAPPMANAGER:
   * - local DB
   * - user action logs
   * - temp transfer folder
   */
  cleanCache: {},

  /**
   * [copyFileFrom]
   * Copy file from a DNP and download it on the client
   *
   * @param {string} id DNP .eth name
   * @param {string} fromPath path to copy file from
   * - If path = path to a file: "/usr/src/app/config.json".
   *   Downloads and sends that file
   * - If path = path to a directory: "/usr/src/app".
   *   Downloads all directory contents, tar them and send as a .tar.gz
   * - If path = relative path: "config.json".
   *   Path becomes $WORKDIR/config.json, then downloads and sends that file
   *   Same for relative paths to directories.
   * @returns {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
   */
  copyFileFrom: {
    mandatoryKwargs: ["id", "fromPath"]
  },

  /**
   * [copyFileTo]
   * Copy file to a DNP
   *
   * @param {string} id DNP .eth name
   * @param {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
   * @param {string} filename name of the uploaded file.
   * - MUST NOT be a path: "/app", "app/", "app/file.txt"
   * @param {string} toPath path to copy a file to
   * - If path = path to a file: "/usr/src/app/config.json".
   *   Copies the contents of dataUri to that file, overwritting it if necessary
   * - If path = path to a directory: "/usr/src/app".
   *   Copies the contents of dataUri to ${dir}/${filename}
   * - If path = relative path: "config.json".
   *   Path becomes $WORKDIR/config.json, then copies the contents of dataUri there
   *   Same for relative paths to directories.
   */
  copyFileTo: {
    mandatoryKwargs: ["id", "dataUri", "filename", "toPath"]
  },

  /**
   * [diagnose]
   * Returns a list of checks done as a diagnose
   *
   * @returns {object} diagnoses object, by diagnose id
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
   * [diskSpaceAvailable]
   *
   * Returns the current disk space available of a requested path
   *
   * [WARNING] Does not work as expected
   *
   * @param {string} path
   * @returns {object} status = {
   *   exists, {bool}
   *   totalSize, {string}
   *   availableSize, {string}
   * }
   */
  diskSpaceAvailable: {
    mandatoryKwargs: ["path"]
  },

  /**
   * [fetchDirectory]
   * Fetches all package names in the custom dappnode directory.
   * This feature helps the ADMIN UI load the directory data faster.
   *
   * @returns {array} A formated success message.
   * result: packages = [{
   *   name: "bitcoin.dnp.dappnode.eth", {string}
   *   status: "preparing", {string}
   *   manifest: <manifest object>, {object}
   *   avatar: <base64 image>, {string}
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
    mandatoryKwargs: ["id"]
  },

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
    mandatoryKwargs: ["id"]
  },

  /**
   * [getStats]
   * Computes the current usage % of cpu, memory and disk
   *
   * @returns {object} status = {
   *   cpu: "35%", {string}
   *   memory: "46%", {string}
   *   disk: "57%", {string}
   * }
   */
  getStats: {},

  /**
   * [getUserActionLogs]
   * Returns the user action logs. This logs are stored in a different
   * file and format, and are meant to ease user support
   * The list is ordered from newest to oldest
   * - Newest log has index = 0
   * - If the param fromLog is out of bounds, the result will be an empty array: []
   *
   * @param {number} fromLog, default value = 0
   * @param {number} numLogs, default value = 50
   * @returns {string} logs, stringified userActionLog JSON objects appended on new lines
   * To parse, by newline and then parse each line individually.
   * userActionLog = {
   *   level: "info" | "error", {string}
   *   event: "installPackage.dnp.dappnode.eth", {string}
   *   message: "Successfully install DNP", {string} Returned message from the call function
   *   result: { data: "contents" }, {*} Returned result from the call function
   *   kwargs: { id: "dnpName" }, {object} RPC key-word arguments
   *   // Only if error
   *   message: e.message, {string}
   *   stack.e.stack {string}
   * }
   */
  getUserActionLogs: {},

  /**
   * [getVersionData]
   *  Returns version data
   *
   * @returns {object} versionData = {
   *   version: "0.1.21",
   *   branch: "master",
   *   commit: "ab991e1482b44065ee4d6f38741bd89aeaeb3cec"
   * }
   */
  getVersionData: {},

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
   * - BYPASS_RESOLVER {bool}: Skips dappGet and just fetches first level dependencies
   * - BYPASS_CORE_RESTRICTION {bool}: Allows dncore DNPs from unverified sources (IPFS)
   * options = { BYPASS_RESOLVER: true, BYPASS_CORE_RESTRICTION: true }
   */
  installPackage: {
    mandatoryKwargs: ["id"]
  },

  /**
   * [installPackageSafe]
   * Installs a package in safe mode, by setting options.BYPASS_RESOLVER = true
   *
   *
   * @param {string} id DNP .eth name
   * @param {object} options install options
   * - BYPASS_CORE_RESTRICTION: Allows dncore DNPs from unverified sources (IPFS)
   * options = { BYPASS_CORE_RESTRICTION: true }
   */
  installPackageSafe: {
    mandatoryKwargs: ["id"]
  },

  /**
   * [listPackages]
   * Returns the list of current containers associated to packages
   *
   * @returns {array} dnpInstalled = [{
   *   id: "923852...", {string}
   *   packageName: "DAppNodePackage-admin...", {string}
   *   version: "0.1.8", {string}
   *   isDnp: true, {bool}
   *   isCore: false, {bool}
   *   created: <data string>, {string}
   *   image: "admin.dnp.dappnode.eth-0.1.8", {string}
   *   name: "admin.dnp.dappnode.eth", {string}
   *   shortName: "admin", {string}
   *   ports: [{
   *     PrivatePort: 2222, {number}
   *     PublicPort: 3333, {number}
   *     Type: "tcp" {string}
   *   }, ... ], {array}
   *   volumes: [{
   *     type: "bind", {string}
   *     name: "admin_data", {string}
   *     path: "source path" {string}
   *   }, ... ] {array}
   *   state: "running", {string}
   *   running: true, {bool}
   *
   *   // From labels
   *   origin: "/ipfs/Qmabcd...", {string}
   *   chain: "ethereum", {string}
   *   dependencies: { dependency.dnp.dappnode.eth: "0.1.8" }, {object}
   *   portsToClose: [ {portNumber: 30303, protocol: 'UDP'}, ...], {array}
   *
   *   // Appended on RPC call
   *   envs: { ENV_NAME: "ENV_VALUE" }, {object}
   *   manifest: <manifest object> {object}
   * }, ... ]
   */
  listPackages: {},

  /**
   * [logPackage]
   * Returns the logs of the docker container of a package
   *
   * @param {string} id DNP .eth name
   * @param {object} options log options
   * - timestamp {bool}: Show timestamps
   * - tail {number}: Number of lines to return from bottom
   * options = { timestamp: true, tail: 200 }
   * @returns {string} logs: <string with escape codes>
   */
  logPackage: {
    mandatoryKwargs: ["id", "options"]
  },

  /**
   * [managePorts]
   * Open or closes requested ports
   *
   * @param {string} action: "open" or "close" (string)
   * @param {array} ports: array of port objects
   * ports = [ { portNumber: 30303, protocol: TCP }, ... ]
   */
  managePorts: {
    mandatoryKwargs: ["ports", "action"]
  },

  /**
   * [notificationsGet]
   * Returns not viewed notifications
   *
   * @returns {object} notifications object, by notification id
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
   * @param {array} ids Array of ids to be marked as read
   * ids = [ "notification-id1", "notification-id2" ]
   */
  notificationsRemove: {
    mandatoryKwargs: ["ids"]
  },

  /**
   * [notificationsTest]
   * Adds a notification to be shown the UI.
   * Set the notification param to null (or send none) to generate
   * a random notification
   *
   * @param {(null|Object)} notification: {
   *   id: "notification-id", {string}
   *   type: "danger", {string}
   *   title: "Some notification", {string},
   *   body: "Some text about notification" {string}
   * }
   */
  notificationsTest: {},

  /**
   * Changes the user `dappnode`'s password in the host machine
   * Only allows it if the current password has the salt `insecur3`
   *
   * @param {string} newPassword super-secure-password
   */
  passwordChange: {
    mandatoryKwargs: ["newPassword"]
  },

  /**
   * Checks if the user `dappnode`'s password in the host machine
   * is NOT the insecure default set at installation time.
   * It does so by checking if the current salt is `insecur3`
   *
   * - This check will be run every time this node app is started
   *   - If the password is SECURE it will NOT be run anymore
   *     and this call will return true always
   *   - If the password is INSECURE this check will be run every
   *     time the admin requests it (on page load)
   *
   * @returns {bool} true = is secure / false = is not
   */
  passwordIsSecure: {},

  /**
   * [removePackage]
   * Remove package data: docker down + disk files
   *
   * @param {string} id DNP .eth name
   * @param {bool} deleteVolumes flag to also clear permanent package data
   */
  removePackage: {
    mandatoryKwargs: ["id", "deleteVolumes"]
  },

  /**
   * [requestChainData]
   * Requests chain data. Also instructs the DAPPMANAGER
   * to keep sending data for a period of time (5 minutes)
   */
  requestChainData: {},

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
   * @returns {object} result  = {
   *   state: {"admin.dnp.dappnode.eth": "0.1.4"},
   *   alreadyUpdated: {"bind.dnp.dappnode.eth": "0.1.2"},
   * }
   */
  resolveRequest: {
    mandatoryKwargs: ["req"]
  },

  /**
   * [restartPackage]
   * Calls docker rm and docker up on a package
   *
   * @param {string} id DNP .eth name
   */
  restartPackage: {
    mandatoryKwargs: ["id"]
  },

  /**
   * [restartPackageVolumes]
   * Removes a package volumes. The re-ups the package
   *
   * @param {string} id DNP .eth name
   */
  restartPackageVolumes: {
    mandatoryKwargs: ["id"]
  },

  /**
   * [togglePackage]
   * Stops or starts after fetching its status
   *
   * @param {string} id DNP .eth name
   * @param {number} timeout seconds to stop the package
   */
  togglePackage: {
    mandatoryKwargs: ["id"]
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
   * @param {bool} restart flag to restart the DNP
   */
  updatePackageEnv: {
    mandatoryKwargs: ["id", "envs", "restart"]
  }
};
