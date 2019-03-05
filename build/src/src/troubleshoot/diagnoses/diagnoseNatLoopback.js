import APIcall from "API/rpcMethods";

export default async () => {
  try {
    const res = await APIcall.getParams();
    if (res.success && res.result) {
      if (res.result.noNatLoopback) {
        return {
          ok: false,
          msg: "No NAT loopback, external IP did not resolve",
          solution: [
            `Please use the internal IP: ${
              res.result.internalIp
            } when you are in the same network as your DAppNode`
          ]
        };
      } else {
        return {
          ok: true,
          msg: "NAT loopback enabled, external IP resolves"
        };
      }
    } else {
      throw Error("Unsuccessful response from VPN");
    }
  } catch (e) {
    return { ok: false, msg: `Error getting external IP status: ${e.message}` };
  }
};
