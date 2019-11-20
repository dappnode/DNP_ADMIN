export function joinCssClass(cssClassObj) {
  const classes = [];
  for (const [key, val] of Object.entries(cssClassObj))
    if (val) classes.push(key);
  return classes.join(" ");
}
