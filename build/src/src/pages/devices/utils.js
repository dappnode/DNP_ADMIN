export function getDeviceId(device) {
  // console.trace(device)
  if (!device) {
    console.warn("Attempting to get id of undefined device");
    return null;
  }
  if (typeof device !== "object") {
    throw Error(
      `Attempting to get id of device that is not an object, d: "${String(
        device
      )}"`
    );
  }
  return "id" in device ? device.id : device.name;
}
