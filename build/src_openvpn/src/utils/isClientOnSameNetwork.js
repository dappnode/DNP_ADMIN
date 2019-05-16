import isIp from "./isIp";

async function isClientOnSameNetwork({ id }) {
  const { origin, hostname } = window.location;

  try {
    const clientIp = await fetch(`${origin}/ip?id=${id}`)
      .then(res => res.text())
      .then(ip => ip.trim());

    // Fetch the dappnode's IP only if necessary
    const dappnodeIp = isIp(hostname)
      ? hostname
      : await fetch(`https://api.exana.io/dns/${hostname}/a`)
          .then(res => res.json())
          .then(data => data.answer[0].name.trim());
    // https://api.exana.io/dns/${hostname}/${recordType} returns
    // { question: [], answer: [{
    //     class: "IN",
    //     name: "aacdd41bb8cbccb1.dyndns.dappnode.io.",
    //     rdata: "83.204.37.201",
    //     rdlength: 4,
    //     ttl: 29,
    //     type: "A"
    // }] };

    return isIp(clientIp) && isIp(dappnodeIp) && clientIp === dappnodeIp;
  } catch (e) {
    console.error(`Error on isClientOnSameNetwork: ${e.stack}`);
    // On error assume it's not
    return false;
  }
}

export default isClientOnSameNetwork;
