import APIcall from "API/rpcMethods";

export default async () => {
  try {
    const res = await APIcall.getParams();
    if (res.success && res.result) {
      if (res.result.alertToOpenPorts) {
        return {
          ok: false,
          msg: "Ports have to be openned and there is no UPnP device available",
          solution: [
            "If you are capable of openning ports manually, please ignore this error",
            "Your router may have UPnP but it is not turned on yet. Please research if your specific router has UPnP and turn it on"
          ]
        };
      } else {
        return {
          ok: true,
          msg: "No ports have to be oppened OR the router has UPnP enabled"
        };
      }
    } else {
      throw Error("Unsuccessful response from VPN");
    }
  } catch (e) {
    return { ok: false, msg: `Error getting UPnP status: ${e.message}` };
  }
};
