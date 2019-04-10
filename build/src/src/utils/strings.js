/**
 * Safe version of String.toLowerCase
 * @param {String} s
 * @returns {String}
 */
export const toLowercase = s => {
  if (!s || typeof s !== "string") return "";
  return s.toLowerCase();
};

/**
 * Capitalizes a string
 * @param {String} string = "hello world"
 * @returns {String} "Hello world"
 */
export const capitalize = s => {
  if (!s || typeof s !== "string") return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Checks if string 1 includes string 2.
 * - If string 1 or string 2 are undefined, returns false
 * - Does the check in lowerCase
 * @param {String} s1 = "HeLLo"
 * @param {String} s2 = "lo"
 * @returns {Bool} = true
 */
export const stringIncludes = (s1, s2) => {
  if (!s1 || typeof s1 !== "string") return false;
  if (!s2 || typeof s2 !== "string") return false;
  return s1.toLowerCase().includes(s2.toLowerCase());
};

/**
 * Converts constant case "SOME_BAR", to a sentence "Some bar"
 * @param {String} s
 */
export const toSentence = s => {
  if (!s || typeof s !== "string") return s;
  return capitalize(s.replace(new RegExp("_", "g"), " ").toLowerCase());
};
