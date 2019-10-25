import merge from "deepmerge";

/**
 * Prevents arrays to keep populating
 */
export function mergeOverwriteArrays<T>(a: T, b: T): T {
  return merge(a, b, {
    arrayMerge: (destinationArray, sourceArray, options) => sourceArray
  });
}
