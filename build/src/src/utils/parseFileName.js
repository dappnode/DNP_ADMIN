import pathUtils from "path";

/**
 * Helper for packages / FileManager
 *
 * @param {string} path
 * @param {string} mimeType
 */
export default function parseFileName(path, mimeType) {
  let fileName = pathUtils.basename(path);

  // Add extension in case it is a compressed directory
  if (
    mimeType === "application/gzip" &&
    !fileName.endsWith(".gzip") &&
    !fileName.endsWith(".gz")
  )
    fileName = `${fileName}.tar.gz`;

  return fileName;
}
