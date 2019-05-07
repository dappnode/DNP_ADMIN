export default function parseDate(rawDate) {
  let date = new Date(rawDate);
  let now = new Date();
  if (sameDay(date, now)) {
    const minAgo = Math.floor((now - date) / 1000 / 60);
    if (minAgo < 30) {
      return "Today, " + minAgo + " min ago";
    }
    return "Today, " + date.toLocaleTimeString();
  }
  return date.toLocaleString();
}

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
