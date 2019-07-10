/**
 * Safe version of String.toLowerCase
 * @param {string} s
 * @returns {string}
 */
export const toLowercase = s => {
  if (!s || typeof s !== "string") return "";
  return s.toLowerCase();
};

/**
 * Capitalizes a string
 * @param {string} string = "hello world"
 * @returns {string} "Hello world"
 */
export const capitalize = s => {
  if (!s || typeof s !== "string") return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Checks if string includes content.
 * - If string or content are undefined, returns false
 * - Does the check in lowerCase
 * @param {string} s = "HeLLo"
 * @param {string} content = "lo"
 * @returns {bool} = true
 */
export const stringIncludes = (s, content) => {
  if (!s || typeof s !== "string") return false;
  if (!content || typeof content !== "string") return false;
  return s.toLowerCase().includes(content.toLowerCase());
};

/**
 * Checks if string endsWith content.
 * - If string or content are undefined, returns false
 * - Does the check in lowerCase
 * @param {string} s = "HeLLo"
 * @param {string} content = "lo"
 * @returns {bool} = true
 */
export const stringEndsWith = (s, content) => {
  if (!s || typeof s !== "string") return false;
  if (!content || typeof content !== "string") return false;
  return s.toLowerCase().endsWith(content.toLowerCase());
};

/**
 * Split string by separator.
 * - If string or separator are undefined, returns an empty array
 * @param {string} s = "vpn.eth"
 * @param {string|object} separator = ".", /\.(.+)/
 * @returns {array} ["vpn", "eth"]
 */
export const stringSplit = (s, separator) => {
  if (!s || typeof s !== "string") return [""];
  if (!separator) return [""];
  return s.split(separator);
};

/**
 * Converts constant case "SOME_BAR", to a sentence "Some bar"
 * @param {string} s
 */
export const toSentence = s => {
  if (!s || typeof s !== "string") return s;
  return capitalize(s.replace(new RegExp("_", "g"), " ").toLowerCase());
};
