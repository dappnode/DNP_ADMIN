import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "API/rpcMethods";
import { confirm } from "components/ConfirmDialog";
// Components
import Card from "components/Card";
import Button from "components/Button";
import Columns from "components/Columns";
import ProgressBar from "react-bootstrap/ProgressBar";
// Utils
import { shortName } from "utils/format";
import humanFS from "utils/humanFileSize";
import newTabProps from "utils/newTabProps";

const baseUrlUpload = "http://my.dappmanager.dnp.dappnode.eth:3000/upload";
const baseUrlDownload = "http://my.dappmanager.dnp.dappnode.eth:3000/download";

function Backup({ dnp }) {
  const id = dnp.name;
  const backup = (dnp.manifest || {}).backup;

  const [progress, setProgress] = useState();
  const [error, setError] = useState("");
  const isOnProgress = progress && progress.label;
  // Specific state for get backup
  const [url, setUrl] = useState("");

  /**
   * Prepares a backup for download
   */
  async function prepareBackupForDownload() {
    try {
      setError("");
      setProgress({ label: "Preparing backup" });
      const fileId = await api.backupGet(
        { id, backup },
        { toastMessage: `Preparing backup for ${shortName(id)}...` }
      );
      setProgress(null);
      if (!fileId) throw Error("Error preparing backup");
      const _url = `${baseUrlDownload}/${fileId}`;
      setUrl(_url);
      window.open(_url, "_newtab");
    } catch (e) {
      setProgress(null);
      setError(e.message);
      console.error(`Error requesting Backup: ${e.message}`);
    }
  }

  /**
   * Restores a DNP backup given a backup file
   * @param {object} file
   */
  function restoreBackup(file) {
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

  function handleClickRestore(file) {
    confirm({
      title: `Restoring backup`,
      text: `This action cannot be undone. The backup data will overwrite any previously existing data.`,
      list: [
        { title: "Selected file", body: `${file.name} (${humanFS(file.size)})` }
      ],
      label: "Restore",
      onClick: () => restoreBackup(file),
      variant: "dappnode"
    });
  }

  // Only render the component if a backup mechanism is provided
  if (!Array.isArray(backup)) return null;

  return (
    <Card className="backup">
      {/* Get backup */}
      <Columns>
        <div>
          <div className="subtle-header">DOWNLOAD BACKUP</div>
          <p>
            Download a backup of the critical files of this package in you local
            machine.
          </p>
          {url ? (
            <a href={url} {...newTabProps} className="no-a-style">
              <Button variant="dappnode">Download backup</Button>
              <div
                style={{
                  opacity: 0.7,
                  fontSize: "0.8rem",
                  marginTop: "0.5rem"
                }}
              >
                Allow browser pop-ups or click download
              </div>
            </a>
          ) : (
            <Button
              onClick={prepareBackupForDownload}
              disabled={isOnProgress}
              variant="dappnode"
            >
              Backup now
            </Button>
          )}
        </div>

        {/* Restore backup */}
        <div>
          <div className="subtle-header">RESTORE BACKUP</div>
          <p>
            Restore an existing backup. Note that this action will overwrite
            existing data.
          </p>
          <Button className="button-file-input" disabled={isOnProgress}>
            <span>Restore</span>
            <input
              type="file"
              id="backup_upload"
              name="file"
              accept=".tar, .xz, .tar.xz, .zip"
              onChange={e => handleClickRestore(e.target.files[0])}
              disabled={isOnProgress}
            />
          </Button>
        </div>
      </Columns>

      {isOnProgress && (
        <div>
          <ProgressBar
            now={progress.percent || 100}
            animated={true}
            label={progress.label || ""}
          />
        </div>
      )}

      {error && <div style={{ color: "red" }}>Error: {error}</div>}
    </Card>
  );
}

Backup.propTypes = {
  dnp: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default Backup;
