// Don't mutate
export default function cleanObj(obj) {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      // delete obj[key];
    } else {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
