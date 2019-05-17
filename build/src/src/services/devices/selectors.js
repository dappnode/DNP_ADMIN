import { mountPoint, superAdminId, credentialsPort } from "./data";
import { createSelector } from "reselect";
// Selectors
import { getDappnodeParams } from "services/dappnodeStatus/selectors";

// Service > devices

/**
 * Return devices as an array and order them to place
 * the superAdmin as the first device
 */
export const getDevices = createSelector(
  state => state[mountPoint],
  getDappnodeParams,
  (devices, dappnodeParams) => {
    const {
      name,
      ip,
      staticIp,
      domain,
      internalIp,
      noNatLoopback
    } = dappnodeParams;
    // Construct url params
    const urlParams = [];
    if (name) urlParams.push(`name=${name}`);
    if (noNatLoopback) {
      urlParams.push(`intip=${internalIp}`);
      if (!staticIp) urlParams.push(`ip=${ip}`);
    }

    // Construct the origin url
    const hostname = staticIp || domain || ip;
    const origin = `http://${hostname}:${credentialsPort}`;

    return Object.values(devices)
      .sort(d1 => (d1.id === superAdminId ? -1 : 0))
      .map(device => {
        const { filename, key } = device;
        // Construct url for the OpenVPN UI
        if (filename && key)
          return {
            ...device,
            url: `${origin}/?${[...urlParams, `id=${filename}`].join(
              "&"
            )}#${encodeURIComponent(key)}`
          };
        else return device;
      });
  }
);

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

export const getDeviceById = createSelector(
  getDevices,
  (_, id) => id,
  (devices, id) => devices.find(d => d.id === id) || {}
);
