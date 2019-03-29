/**
 * Safe version of String.toLowercase
 * @param {String} s
 * @returns {String}
 */
export const toLowercase = s => (s ? s.toLowerCase() : s);

/**
 * Capitalizes a string
 * @param {String} string = "hello world"
 * @returns {String} "Hello world"
 */
export const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Checks if string 1 includes string 2.
 * - If string 1 or string 2 are undefined, returns false
 * - Does the check in lowerCase
 * @param {String} s1 = "HeLLo"
 * @param {String} s2 = "lo"
 * @returns {Bool} = true
 */
export const stringIncludes = (s1, s2) =>
  !s1 || !s2 ? false : s1.toLowerCase().includes(s2.toLowerCase());
