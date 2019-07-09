export default function humanFileSize(size = 0) {
  if (!size || isNaN(size) || size === 0 || size === "0") return 0;
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}
