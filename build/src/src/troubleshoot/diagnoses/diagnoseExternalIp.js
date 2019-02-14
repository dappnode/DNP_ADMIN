import APIcall from "API/rpcMethods";

export default async () => {
  try {
    const res = await APIcall.statusExternalIp();
    if (res.success && res.result) {
      if (res.result.externalIpResolves) {
        return {
          ok: true,
          msg: "External IP resolves"
        };
      } else {
        const {
          internalIp = "(missing-ip)",
          externalIp = "(missing-ip)"
        } = res.result;
        return {
          ok: false,
          msg: "External IP does not resolve",
          solution: [
            `Please use the internal IP: ${internalIp} when you are in the same network as your DAppNode and the external IP: ${externalIp} otherwise"`
          ]
        };
      }
    } else {
      throw Error("Unsuccessful response from VPN");
    }
  } catch (e) {
    return { ok: false, msg: `Error getting external IP status: ${e.message}` };
  }
};
