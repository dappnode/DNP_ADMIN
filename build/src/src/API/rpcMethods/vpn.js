/**
 * VPN WAMP RPC METHODS
 * This file describes the available RPC methods of the DAPPMANAGER module
 * It serves as documentation and as a mechanism to quickly add new calls
 *
 * Each key of this object is the last subdomain of the entire event:
 *   event = "addDevice.vpn.dnp.dappnode.eth"
 *   Object key = "addDevice"
 */

export default {
  /**
   * [ping]
   * Default method to check if app is alive
   *
   * @returns {*}
   */
  ping: {},

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
   * [addDevice]
   * Creates a new device with the provided id.
   * Generates certificates and keys needed for OpenVPN.
   *
   * @param {string} id Device id name
   * @returns {string}
   */
  addDevice: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [getDeviceCredentials]
   * Creates a new OpenVPN credentials file, encrypted.
   * The filename is the (16 chars short) result of hashing the generated salt in the db,
   * concatenated with the device id.
   *
   * @param {string} id Device id name
   * @returns {Object} result = {
   *   filename: "", {string}
   *   key: "" {string}
   * }
   */
  getDeviceCredentials: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [removeDevice]
   * Removes the device with the provided id, if exists.
   *
   * @param {string} id Device id name
   */
  removeDevice: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [resetDevice]
   * Resets the device credentials with the provided id, if exists.
   *
   * @param {string} id Device id name
   */
  resetDevice: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [toggleAdmin]
   * Gives/removes admin rights to the provided device id.
   *
   * @param {string} id Device id name
   */
  toggleAdmin: {
    manadatoryKwargs: ["id"]
  },

  /**
   * [listDevices]
   * Returns a list of the existing devices, with the admin property
   *
   * @param {string} id Device id name
   * @returns {object} devices = [{
   *   id: "myDevice", {string}
   *   admin: true {bool}
   * }]
   */
  listDevices: {},

  /**
   * [getParams]
   * Returns the current DAppNode identity
   *
   * @returns {object} result: {
   *   ip: '85.84.83.82',
   *   name: 'My-DAppNode',
   *   staticIp: '85.84.83.82', (Optional)
   *   domain: '1234acbd.dyndns.io (Optional)
   *   upnpAvailable: true / false,
   *   noNatLoopback: true / false,
   *   alertToOpenPorts: true / false,
   *   internalIp: 192.168.0.1,
   * }
   */
  getParams: {},

  /**
   * [setStaticIp]
   * Sets the static IP
   *
   * @param {(string|null)} staticIp New static IP
   * - To enable: "85.84.83.82"
   * - To disable: null
   */
  setStaticIp: {
    manadatoryKwargs: ["staticIp"]
  }
};
