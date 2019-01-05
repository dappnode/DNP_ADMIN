export default function parseType(status) {
  if (status === 1) return "success";
  if (status === 0) return "warning";
  if (status === -1) return "danger";
  else return "default";
}
