export default function sortByProp(prop) {
  return (a, b) => (a[prop] > b[prop] ? 1 : -1);
}
