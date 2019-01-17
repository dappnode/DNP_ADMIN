// Expected format
// http://origin/id#key
// - id: is an alphanumeric identifier
// - key: base64 encoded string
// 
// http://origin/7e00cfadbe61f2ed#mc5pGQQ4VbbuWJDayJD0kXsElAUddmUktJYUYSDNaDE=

export default function getParamsFromUrl() {
  const id = clean(window.location.pathname)
  const key = clean(window.location.hash)
  if (!id) throw Error('No valid id provided. Url must be http://origin/id#key')
  if (!key) throw Error('No valid key provided. Url must be http://origin/id#key')
  return { key, id };
}

function clean(s) {
  if (!s) return s
  return s.trim().replace('/', '').replace('#', '')
}
