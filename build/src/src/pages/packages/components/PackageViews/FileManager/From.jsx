import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import api from "API/rpcMethods";
// Components
import Input from "components/Input";
import Button from "components/Button";
// Utils
import { shortName } from "utils/format";
import dataUriToBlob from "utils/dataUriToBlob";
import { saveAs } from "file-saver";
import { stringSplit } from "utils/strings";

function From({ id, from }) {
  const [fromPathInput, setFromPathInput] = useState("");

  const downloadFile = useCallback(
    async fromPath => {
      try {
        /**
         * [copyFileFrom]
         * Copy file from a DNP and download it on the client
         *
         * @param {string} id DNP .eth name
         * @param {string} fromPath path to copy file from
         * - If path = path to a file: "/usr/src/app/config.json".
         *   Downloads and sends that file
         * - If path = path to a directory: "/usr/src/app".
         *   Downloads all directory contents, tar them and send as a .tar.gz
         * - If path = relative path: "config.json".
         *   Path becomes $WORKDIR/config.json, then downloads and sends that file
         *   Same for relative paths to directories.
         * @returns {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
         */
        const dataUri = await api.copyFileFrom(
          { id, fromPath },
          { toastMessage: `Copying file from ${shortName(id)} ${fromPath}...` }
        );
        if (!dataUri) return;

        const blob = dataUriToBlob(dataUri);
        const fileName = parseFileName(fromPath, blob.type);

        saveAs(blob, fileName);
      } catch (e) {
        console.error(`Error on copyFileFrom ${id} ${fromPath}: ${e.stack}`);
      }
    },
    [id]
  );

  useEffect(() => {
    if (from) {
      setFromPathInput(from);
      downloadFile(from);
    }
  }, [from, downloadFile]);

  return (
    <div className="card-subgroup">
      {/* FROM, chose path */}
      <Input
        placeholder="Container from path"
        value={fromPathInput}
        onValueChange={setFromPathInput}
        append={
          <Button
            onClick={() => downloadFile(fromPathInput)}
            disabled={!fromPathInput}
            variant="dappnode"
          >
            Download
          </Button>
        }
      />
    </div>
  );
}

function parseFileName(path, mimeType) {
  if (!path || typeof path !== "string") return path;
  const subPaths = stringSplit(path, "/");
  let fileName = subPaths[subPaths.length - 1] || "";

  // Add extension in case it is a compressed directory
  if (
    mimeType === "application/gzip" &&
    !fileName.endsWith(".gzip") &&
    !fileName.endsWith(".gz")
  )
    fileName = `${fileName}.tar.gz`;

  return fileName;
}

From.propTypes = {
  id: PropTypes.string.isRequired
};

export default From;
