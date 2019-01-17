export function shortName(ens) {
  if (!ens) return ens;
  if (!ens.includes(".")) return ens;
  return ens.split(".")[0];
}

export const colors = {
  success: "#63beb6db",
  warning: "#b1b1b1db",
  error: "#da2424cc",
  default: "#b1b1b1db"
};
