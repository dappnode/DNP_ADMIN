import APIcall from "API/rpcMethods";

export default async () => {
  try {
    const res = await APIcall.statusUPnP();
    if (res.success && res.result) {
      if (res.result.openPorts && !res.result.upnpAvailable) {
        return {
          ok: false,
          msg: "Ports have to be openned and there is no UPnP device available",
          solution: [
            "If you are capable of openning ports manually, please ignore this error",
            "Your router may have UPnP but they are not turned on yet. Please research if your specific router has UPnP and turn it on"
          ]
        };
      } else {
        return {
          ok: true,
          msg: res.result.openPorts
            ? "Ports have to be openned and there is an UPnP device available"
            : "No ports have to be oppened"
        };
      }
    } else {
      throw Error("Unsuccessful response from VPN");
    }
  } catch (e) {
    return { ok: false, msg: `Error getting UPnP status: ${e.message}` };
  }
};
