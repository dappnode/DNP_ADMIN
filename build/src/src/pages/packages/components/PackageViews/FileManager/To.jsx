import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Components
import Input from "components/Input";
import Button from "components/Button";
// Utils
import humanFileSize from "utils/humanFileSize";

const fileSizeWarning = 1e6;

function To({ path, upload }) {
  const [file, setFile] = useState(null);
  const [toPath, setToPath] = useState("");

  useEffect(() => {
    setToPath(path);
  }, [path]);

  const { name, size } = file || {};

  return (
    <div className="card-subgroup">
      <div className="section-card-subtitle">Upload to DAppNode Package</div>
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
        append={<Button onClick={() => upload(file, toPath)}>Upload</Button>}
      />
    </div>
  );
}

To.propTypes = {
  path: PropTypes.string.isRequired,
  upload: PropTypes.func.isRequired
};

export default To;
