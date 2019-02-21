// VPN WAMP RPC METHODS
// This file describes the available RPC methods of the DAPPMANAGER module
// It serves as documentation and as a mechanism to quickly add new calls
//
// Each key of this object is the last subdomain of the entire event:
//   event = "addDevice.vpn.dnp.dappnode.eth"
//   Object key = "addDevice"

export default {
  // addDevice
  // > kwargs: { id }
  // > result: {}
  addDevice: {
    manadatoryKwargs: ["id"]
  },

  // removeDevice
  // > kwargs: { id }
  // > result: {}
  removeDevice: {
    manadatoryKwargs: ["id"]
  },

  // toggleAdmin
  // > kwargs: { id }
  // > result: {}
  toggleAdmin: {
    manadatoryKwargs: ["id"]
  },

  // listDevices
  // > kwargs: {}
  // > result: {}
  listDevices: {},

  // getParams
  // > kwargs: {}
  // > result: {}
  getParams: {},

  // toggleGuestUsers
  // > kwargs: {}
  // > result: {}
  toggleGuestUsers: {},

  // resetGuestUsersPassword
  // > kwargs: {}
  // > result: {}
  resetGuestUsersPassword: {},

  // statusUPnP:
  // > kwargs: {}
  // > result: {
  //     openPorts: <Bool>, // if ports have to be opened
  //     upnpAvailable: <Bool>,
  //   }
  statusUPnP: {},

  // statusExternalIp:
  // > kwargs: {}
  // > result: {
  //     externalIpResolves: <Bool>,
  //     externalIp: <String>,
  //     internalIp: <String>,
  //   }
  statusExternalIp: {},

  // setStaticIp:
  // > kwargs: { staticIp }
  // > result: {}
  setStaticIp: {
    manadatoryKwargs: ["staticIp"]
  }
};
