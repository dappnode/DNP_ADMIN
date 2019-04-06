import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "API/rpcMethods";
// Components
import Input from "components/Input";
import { ButtonLight } from "components/Button";
// Utils
import { shortName } from "utils/format";
import dataUriToBlob from "utils/dataUriToBlob";
import { saveAs } from "file-saver";

function From({ id }) {
  const [fromPath, setFromPath] = useState("");

  async function downloadFile() {
    try {
      const dataUri = await api.copyFileFrom(
        { id, fromPath },
        { toastMessage: `Copying file from ${shortName(id)} ${fromPath}...` }
      );
      if (!dataUri) return;
      const blob = dataUriToBlob(dataUri);
      const fileName = fromPath.split("/")[fromPath.split("/").length - 1];
      saveAs(blob, fileName);
    } catch (e) {
      console.error(`Error on copyFileFrom ${id} ${fromPath}: ${e.stack}`);
    }
  }

  return (
    <div className="card-subgroup">
      <div className="section-card-subtitle">Download from DNP</div>
      {/* FROM, chose path */}
      <Input
        placeholder="Container from path"
        value={fromPath}
        onValueChange={setFromPath}
        append={
          <ButtonLight onClick={downloadFile} disabled={!fromPath}>
            Download
          </ButtonLight>
        }
      />
    </div>
  );
}

From.propTypes = {
  id: PropTypes.string.isRequired
};

export default From;
