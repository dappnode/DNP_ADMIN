// VPN WAMP RPC METHODS
// This file describes the available RPC methods of the DAPPMANAGER module
// It serves as documentation and as a mechanism to quickly add new calls
//
// Each key of this object is the last subdomain of the entire event:
//   event = "addDevice.vpn.dnp.dappnode.eth"
//   Object key = "addDevice"

export default {
  // ping - default method to check if app is alive
  // > kwargs: {}
  // > result: {
  //     version: "0.1.21",
  //     branch: "master",
  //     commit: "ab991e1482b44065ee4d6f38741bd89aeaeb3cec"
  //   }
  ping: {},

  // addDevice:
  //  Creates a new device with the provided id.
  //  Generates certificates and keys needed for OpenVPN.
  //  > kwargs: { id }
  //  > result: -
  addDevice: {
    manadatoryKwargs: ["id"]
  },

  // getDeviceCredentials:
  //  Creates a new OpenVPN credentials file, encrypted.
  //  The filename is the (16 chars short) result of hashing the generated salt in the db,
  //  concatenated with the device id.
  //  > kwargs: { id }
  //  > result: {
  //      filename, <String>
  //      key, <String>
  //    }
  getDeviceCredentials: {
    manadatoryKwargs: ["id"]
  },

  // removeDevice:
  //  Removes the device with the provided id, if exists.
  //  > kwargs: { id }
  //  > result: -
  removeDevice: {
    manadatoryKwargs: ["id"]
  },

  // resetDevice:
  //  Resets the device credentials with the provided id, if exists.
  //  > kwargs: { id }
  //  > result: -
  resetDevice: {
    manadatoryKwargs: ["id"]
  },

  // toggleAdmin:
  //  Gives/removes admin rights to the provided device id.
  //  > kwargs: { id }
  //  > result: -
  toggleAdmin: {
    manadatoryKwargs: ["id"]
  },

  // listDevices:
  //  Returns a list of the existing devices, with the admin property
  //  > kwargs: {}
  //  > result: [
  //     { id, <String>
  //       admin, <Boolean> },
  //     ...
  //   ]
  listDevices: {},

  // getParams:
  //  Returns the current DAppNode identity
  //  > kwargs: {}
  //  > result: {
  //     ip: '85.84.83.82',
  //     name: 'My-DAppNode',
  //     staticIp: '85.84.83.82', (Optional)
  //     domain: '1234acbd.dyndns.io (Optional)
  //     upnpAvailable: true / false,
  //     noNatLoopback: true / false,
  //     alertToOpenPorts: true / false,
  //     internalIp: 192.168.0.1,
  //  }
  getParams: {},

  // toggleGuestUsers:
  //  > kwargs: {}
  //  > result: -
  toggleGuestUsers: {},

  // resetGuestUsersPassword:
  //  > kwargs: {}
  //  > result: -
  resetGuestUsersPassword: {},

  // statusUPnP:
  //  > kwargs: {}
  //  > result: {
  //      openPorts: <Bool>, // if ports have to be opened
  //      upnpAvailable: <Bool>,
  //    }
  statusUPnP: {},

  // statusExternalIp:
  //  > kwargs: {}
  //  > result: {
  //     externalIpResolves: <Bool>,
  //     externalIp: <String>,
  //     internalIp: <String>,
  //  }
  statusExternalIp: {},

  // setStaticIp:
  //  > kwargs: { staticIp }
  //  > result: {}
  setStaticIp: {
    manadatoryKwargs: ["staticIp"]
  }
};
