export default async function checkWampPackage(session, packageName) {
  const call = "ping." + packageName + ".dnp.dappnode.eth";
  return session
    .call(call, ["pinging from DNP_ADMIN"])
    .then(
      res => ({ status: 1, msg: "ok" }),
      err => ({ status: -1, msg: formatCrossbarError(err) })
    );
}

function formatCrossbarError(err) {
  return err.error && err.error.includes("no_such_procedure")
    ? "Unreachable"
    : err.error || err.message || JSON.stringify(err);
}
