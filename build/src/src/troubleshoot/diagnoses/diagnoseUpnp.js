import * as APIcall from "API/rpcMethods";

export default async () => {
  try {
    const res = await APIcall.getStatusUpnp();
    if (!res.success) throw Error("Error getting upnp status");
    if (
      res.success &&
      res.result &&
      res.result.openPorts &&
      !res.result.upnpAvailable
    )
      return {
        ok: false,
        msg: "Ports have to be openned and there is no UPnP device available",
        solution: [
          "If you are capable of openning ports manually, please ignore this error",
          "Your router may have UPnP but they are not turned on yet. Please research if your specific router has UPnP and turn it on"
        ]
      };
    return {
      ok: true,
      msg: res.result.openPorts
        ? "Ports have to be openned and there is an UPnP device available"
        : "No ports have to be oppened"
    };
  } catch (e) {
    return { ok: false, msg: e.message };
  }
};
