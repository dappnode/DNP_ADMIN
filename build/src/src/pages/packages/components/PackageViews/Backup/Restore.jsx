import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as a from "../../../actions";
import api from "API/rpcMethods";
// Components
import Button from "components/Button";
// Utils
import { shortName } from "utils/format";
import humanFS from "utils/humanFileSize";

const baseUrlUpload = "http://my.dappmanager.dnp.dappnode.eth:3000/upload";

function Restore({ id, backup, setProgress, isOnProgress, error, setError }) {
  function handleFileChange(e) {
    const file = e.target.files[0];
    submit(file);
  }

  function submit(file) {
    setError("");

    const xhr = new XMLHttpRequest();
    // Bind the FormData object and the form element
    const formData = new FormData();
    formData.append("file", file);

    // Define what happens on successful data submission
    xhr.addEventListener("load", e => {
      setProgress(null);
      const fileId = e.target.responseText;
      // if responseText is not a 32bytes hex, abort
      if (!/[0-9A-Fa-f]{64}/.test(fileId))
        return setError(`Wrong response: ${fileId}`);

      setProgress({ label: "Restoring backup..." });
      api
        .backupRestore(
          { id, backup, fileId },
          { toastMessage: `Restoring backup for ${shortName(id)}...` }
        )
        .then(() => {
          setProgress(null);
        });
    });

    // Define what happens in case of error
    xhr.addEventListener("error", e => {
      setProgress(null);
      setError("Something went wrong");
    });

    if (xhr.upload)
      xhr.upload.addEventListener(
        "progress",
        e => {
          const { loaded, total } = e;
          const percent = ((100 * (loaded || 0)) / (total || 1)).toFixed(2);
          setProgress({
            percent,
            label: `${percent}% ${humanFS(loaded)} / ${humanFS(total)}`
          });
        },
        false
      );

    // Set up our request
    xhr.open("POST", baseUrlUpload);
    // The data sent is what the user provided in the form
    xhr.send(formData);
  }

  return (
    <div className="card-subgroup">
      <Button className="button-file-input" disabled={isOnProgress}>
        <span>Restore backup</span>
        <input
          type="file"
          id="backup_upload"
          name="file"
          accept=".tar, .xz, .tar.xz, .zip"
          onChange={handleFileChange}
          disabled={isOnProgress}
        />
      </Button>
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
