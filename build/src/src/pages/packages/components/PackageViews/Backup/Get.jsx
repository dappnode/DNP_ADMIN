import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "API/rpcMethods";
// Components
import Button from "components/Button";
// Utils
import { shortName } from "utils/format";
import newTabProps from "utils/newTabProps";

const baseUrlDownload = "http://my.dappmanager.dnp.dappnode.eth:3000/download";

function Get({ id, backup, setProgress, isOnProgress, error, setError }) {
  const [url, setUrl] = useState("");

  async function downloadFile() {
    try {
      setError("");
      setUrl("");
      setProgress({ label: "Preparing backup" });
      const fileId = await api.backupGet(
        { id, backup },
        { toastMessage: `Preparing backup for ${shortName(id)}...` }
      );

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

  return (
    <div className="card-subgroup">
      {url ? (
        <a href={url} {...newTabProps} className="no-a-style">
          <Button variant="dappnode">Download backup</Button>
          <div
            style={{ opacity: 0.7, fontSize: "0.8rem", marginTop: "0.5rem" }}
          >
            Allow browser pop-ups or click download
          </div>
        </a>
      ) : (
        <Button onClick={downloadFile} disabled={isOnProgress}>
          Backup now
        </Button>
      )}
    </div>
  );
}

Get.propTypes = {
  id: PropTypes.string.isRequired
};

export default Get;
