import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "API/rpcMethods";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Button from "components/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
// Utils
import { shortName } from "utils/format";
import humanFS from "utils/humanFileSize";
import newTabProps from "utils/newTabProps";

const baseUrlUpload = "http://my.dappmanager.dnp.dappnode.eth:3000/upload";
const baseUrlDownload = "http://my.dappmanager.dnp.dappnode.eth:3000/download";

const backupFake = [
  {
    name: "modules",
    path: "/usr/src/app/node_modules"
  },
  {
    name: "src",
    path: "/usr/src/app/src"
  },
  {
    name: "secrets",
    path: "/usr/src/app/secrets"
  },
  {
    name: "etc",
    path: "/usr/src/app/etc"
  }
];

function Backup({ dnp }) {
  const id = dnp.name;
  const backup = (dnp.manifest || {}).backup || backupFake;

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

  // Only render the component if a backup mechanism is provided
  if (!Array.isArray(backup)) return null;

  return (
    <>
      <SubTitle>Backup</SubTitle>
      <Card className="backup">
        <div>
          This DAppNode Package backup will contain the items:{" "}
          {backup.map(({ name }) => name).join(", ")}
        </div>

        {/* Get backup */}
        <div>
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
            <Button onClick={prepareBackupForDownload} disabled={isOnProgress}>
              Backup now
            </Button>
          )}
        </div>

        {/* Restore backup */}
        <div>
          <Button className="button-file-input" disabled={isOnProgress}>
            <span>Restore backup</span>
            <input
              type="file"
              id="backup_upload"
              name="file"
              accept=".tar, .xz, .tar.xz, .zip"
              onChange={e => restoreBackup(e.target.files[0])}
              disabled={isOnProgress}
            />
          </Button>
        </div>

        {isOnProgress && (
          <div>
            <ProgressBar
              now={progress.percent || 100}
              animated={true}
              label={progress.label || ""}
            />
          </div>
        )}

        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </Card>
    </>
  );
}

Backup.propTypes = {
  dnp: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default Backup;
