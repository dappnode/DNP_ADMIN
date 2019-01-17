import ens from "./ens";

// Ens throws if a node is not found
//
// ens.resolver('admin.dnp.dappnode.eth').addr()
// ==> 0xee66c4765696c922078e8670aa9e6d4f6ffcc455
// ens.resolver('fake.dnp.dappnode.eth').addr()
// ==> Unhandled rejection Error: ENS name not found
//
// Change behaviour to return null if not found
export default async function resolveEns(ensName) {
  try {
    return await ens.resolver(ensName).addr();
  } catch (e) {
    if (e.message.includes("not found")) return null;
    else throw e;
  }
}
