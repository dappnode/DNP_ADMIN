export default function parseLevel(level) {
  if (level === "error") return "danger";
  if (level === "warn") return "warning";
  if (level === "info") return "success";
}
