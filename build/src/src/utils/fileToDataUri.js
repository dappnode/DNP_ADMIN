/**
 * Converts a file object to data URI
 *
 * @param {object} file file object obtained from an <input type="file"/>
 * @returns {string} data URI: data:application/zip;base64,UEsDBBQAAAg...
 */
export default function fileToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      // fileContent is a base64 URI = data:application/zip;base64,UEsDBBQAAAg...
      const fileContent = e.target.result;
      resolve(fileContent);
    };
  });
}
