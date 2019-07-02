import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "API/rpcMethods";
// Components
import { ButtonLight } from "components/Button";
// Utils
import { shortName } from "utils/format";
import newTabProps from "utils/newTabProps";

const baseUrlDownload = "http://my.dappmanager.dnp.dappnode.eth:3000/download";

function Get({ id, backup }) {
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  async function downloadFile() {
    try {
      setError("");
      setUrl("");
      const fileId = await api.backupGet(
        { id, backup },
        { toastMessage: `Preparing backup for ${shortName(id)}...` }
      );
      if (!fileId) return;
      const _url = `${baseUrlDownload}/${fileId}`;
      setUrl(_url);
      window.open(_url, "_newtab");
    } catch (e) {
      setError(e.message);
      console.error(`Error requesting Backup: ${e.message}`);
    }
  }

  return (
    <div className="card-subgroup">
      <div className="section-card-subtitle">Get</div>
      {url ? (
        <a href={url} {...newTabProps} className="no-a-style">
          <ButtonLight>Download</ButtonLight>
        </a>
      ) : (
        <ButtonLight onClick={downloadFile}>Get backup</ButtonLight>
      )}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}

Get.propTypes = {
  id: PropTypes.string.isRequired
};

export default Get;
