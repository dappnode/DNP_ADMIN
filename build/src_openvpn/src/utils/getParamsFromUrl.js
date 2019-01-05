export default function getParamsFromUrl() {
  const href = window.location.href;
  if (!href.includes("#") || !href.includes("&")) {
    throw Error("Invalid url, no # & characters found");
  }
  const hash = href.split("#")[1];
  const [id, key] = hash.split("&");
  if (!id || !key) {
    throw Error("Invalid url, no id or key params found");
  }
  return { key, id };
}
