import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as a from "../../../actions";
// Components
import Input from "components/Input";
import { ButtonLight } from "components/Button";
// Utils
import fileToDataUri from "utils/fileToDataUri";
import humanFileSize from "utils/humanFileSize";

function To({ id, copyFileTo }) {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     selectedFile: null,
  //     toPath: null,
  //     fromPath: null
  //   };
  // }
  const [file, setFile] = useState(null);
  const [toPath, setToPath] = useState("");

  async function uploadFile() {
    try {
      const dataUri = await fileToDataUri(file);
      copyFileTo({ id, dataUri, toPath });
    } catch (e) {
      console.error(`Error on copyFileFrom ${id} ${toPath}: ${e.stack}`);
    }
  }

  const { name, size } = file || {};

  return (
    <div className="card-subgroup">
      <div className="section-card-subtitle">Upload to DNP</div>
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
      {/* TO, choose destination path */}
      <Input
        placeholder="Container destination path"
        value={toPath}
        onValueChange={setToPath}
        append={
          <ButtonLight onClick={uploadFile} disabled={!toPath}>
            Upload
          </ButtonLight>
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
