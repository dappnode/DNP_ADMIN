export function getDeviceId(d) {
  // console.trace(d)
  if (!d) {
    console.warn("Attempting to get id of undefined device");
    return null;
  }
  if (typeof d !== "object") {
    throw Error(
      `Attempting to get id of device that is not an object, d: "${String(d)}"`
    );
  }
  return "id" in d ? d.id : d.name;
}
