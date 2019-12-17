import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as a from "../../../actions";
// Components
import Input from "components/Input";
import Button from "components/Button";
// Utils
import fileToDataUri from "utils/fileToDataUri";
import humanFileSize from "utils/humanFileSize";

const fileSizeWarning = 1e6;

function To({ id, copyFileTo, to }) {
  const [file, setFile] = useState(null);
  const [toPath, setToPath] = useState("");

  useEffect(() => {
    if (to) setToPath(to);
  }, [to]);

  const { name, size } = file || {};

  async function uploadFile() {
    try {
      const dataUri = await fileToDataUri(file);
      /**
       * [copyFileTo]
       * Copy file to a DNP
       *
       * @param {string} id DNP .eth name
       * @param {string} dataUri = "data:application/zip;base64,UEsDBBQAAAg..."
       * @param {string} filename name of the uploaded file.
       * - MUST NOT be a path: "/app", "app/", "app/file.txt"
       * @param {string} toPath path to copy a file to
       * - If path = path to a file: "/usr/src/app/config.json".
       *   Copies the contents of dataUri to that file, overwritting it if necessary
       * - If path = path to a directory: "/usr/src/app".
       *   Copies the contents of dataUri to ${dir}/${filename}
       * - If path = relative path: "config.json".
       *   Path becomes $WORKDIR/config.json, then copies the contents of dataUri there
       *   Same for relative paths to directories.
       */
      copyFileTo({ id, dataUri, filename: name, toPath });
    } catch (e) {
      console.error(`Error on copyFileFrom ${id} ${toPath}: ${e.stack}`);
    }
  }

  return (
    <div className="card-subgroup">
      {/* TO, choose source file */}
      <div className="input-group mb-3">
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            onChange={e => setFile(e.target.files[0])}
          />
          <label className="custom-file-label" htmlFor="inputGroupFile01">
            {name ? `${name} (${humanFileSize(size || 0)})` : "Choose file"}
          </label>
        </div>
      </div>

      {name && size > fileSizeWarning && (
        <div className="alert alert-secondary">
          Note that this tool is not meant for large file transfers. Expect
          unstable behaviour.
        </div>
      )}

      {/* TO, choose destination path */}
      <Input
        placeholder="Defaults to $WORKDIR/"
        value={toPath}
        onValueChange={setToPath}
        append={
          <Button onClick={uploadFile} disabled={!file} variant="dappnode">
            Upload
          </Button>
        }
      />
    </div>
  );
}

To.propTypes = {
  id: PropTypes.string.isRequired,
  copyFileTo: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  copyFileTo: a.copyFileTo
};

export default connect(
  null,
  mapDispatchToProps
)(To);
