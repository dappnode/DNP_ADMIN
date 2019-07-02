import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as a from "../../../actions";
import api from "API/rpcMethods";
// Components
import { ButtonLight } from "components/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
// Utils
import { shortName } from "utils/format";
import humanFileSize from "utils/humanFileSize";

const baseUrlUpload = "http://my.dappmanager.dnp.dappnode.eth:3000/upload";

function Restore({ id, backup, copyFileTo }) {
  const [file, setFile] = useState(null);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [restoring, setRestoring] = useState(false);

  const { name, size } = file || {};

  async function restoreBackupWithFileId(fileId) {
    try {
      setRestoring(true);
      await api.backupRestore(
        { id, backup, fileId },
        {
          toastMessage: `Restoring backup for ${shortName(id)}...`,
          throw: true
        }
      );
      setFile(null);
    } catch (e) {
      console.error(e);
    } finally {
      setRestoring(false);
    }
  }

  function submit() {
    setError("");

    const xhr = new XMLHttpRequest();
    // Bind the FormData object and the form element
    const formData = new FormData();
    formData.append("file", file);

    // Define what happens on successful data submission
    xhr.addEventListener("load", e => {
      setLoaded(0);
      setTotal(0);
      const { responseText } = e.target;
      if (!/[0-9A-Fa-f]{64}/.test(responseText))
        setError(`Wrong response: ${responseText}`);
      else restoreBackupWithFileId(responseText);
    });

    // Define what happens in case of error
    xhr.addEventListener("error", e => {
      setLoaded(0);
      setTotal(0);
      setError("Something went wrong");
    });

    if (xhr.upload)
      xhr.upload.addEventListener(
        "progress",
        e => {
          setLoaded(e.loaded); // In bytes
          setTotal(e.total); // In bytes
        },
        false
      );

    // Set up our request
    xhr.open("POST", baseUrlUpload);
    // The data sent is what the user provided in the form
    xhr.send(formData);
  }

  const percent = ((100 * (loaded || 0)) / (total || 1)).toFixed(2);

  return (
    <div className="card-subgroup">
      <div className="section-card-subtitle">Restore</div>
      {/* TO, choose source file */}

      <div className="input-group mb-3">
        <div className="custom-file">
          <input
            type="file"
            id="backup_upload"
            name="file"
            accept=".tar, .xz, .tar.xz, .zip"
            className="custom-file-input"
            onChange={e => setFile(e.target.files[0])}
            disabled={Boolean(total) || restoring}
          />
          <label className="custom-file-label" htmlFor="inputGroupFile01">
            {name ? `${name} (${humanFileSize(size || 0)})` : "Choose file"}
          </label>
        </div>
      </div>

      {file && !Boolean(total) && !restoring && (
        <ButtonLight onClick={submit}>Upload</ButtonLight>
      )}

      {Boolean(total) && (
        <ProgressBar
          now={percent || 100}
          animated={true}
          label={`${percent}% ${loaded} / ${total}`}
        />
      )}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}

Restore.propTypes = {
  id: PropTypes.string.isRequired,
  copyFileTo: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  copyFileTo: a.copyFileTo
};

export default connect(
  null,
  mapDispatchToProps
)(Restore);
