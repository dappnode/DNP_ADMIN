import React from "react";
import { connect } from "react-redux";
import * as a from "../../actions";
import { createStructuredSelector } from "reselect";
// Utils
import fileToDataUri from "utils/fileToDataUri";
import humanFileSize from "utils/humanFileSize";

class EnvVariablesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      toPath: null,
      fromPath: null
    };
  }

  async uploadFile() {
    const dnp = this.props.dnp || {};
    const selectedFile = this.state.selectedFile;
    this.props.copyFileTo({
      id: dnp.name,
      dataUri: await fileToDataUri(selectedFile),
      toPath: this.state.toPath
    });
  }

  async downloadFile() {
    const dnp = this.props.dnp || {};
    this.props.copyFileFrom({
      id: dnp.name,
      fromPath: this.state.fromPath
    });
  }

  handleselectedFile(e) {
    const file = e.target.files[0];
    this.setState({
      selectedFile: file
    });
  }

  render() {
    const fileName = (this.state.selectedFile || {}).name;
    const fileSize = humanFileSize((this.state.selectedFile || {}).size || 0);
    const toPath = this.state.toPath;
    const fromPath = this.state.fromPath;

    return (
      <React.Fragment>
        <div className="section-subtitle">File Manager</div>
        <div className="card mb-4">
          <div className="card-body">
            {/* TO */}
            <div className="card-subgroup">
              <div className="section-card-subtitle">Upload to DNP</div>
              {/* TO, choose source file */}
              <div className="input-group mb-3">
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="inputGroupFile01"
                    aria-describedby="inputGroupFileAddon01"
                    onChange={e =>
                      this.setState({ selectedFile: e.target.files[0] })
                    }
                  />
                  <label
                    className="custom-file-label"
                    htmlFor="inputGroupFile01"
                  >
                    {fileName ? `${fileName} (${fileSize})` : "Choose file"}
                  </label>
                </div>
              </div>
              {/* TO, choose destination path */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Container destination path"
                  onChange={e => this.setState({ toPath: e.target.value })}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={this.uploadFile.bind(this)}
                    disabled={!fileName || !toPath}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>

            {/* FROM */}
            <div className="card-subgroup">
              <div className="section-card-subtitle">Download from DNP</div>
              {/* FROM, chose path */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Container from path"
                  onChange={e => this.setState({ fromPath: e.target.value })}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={this.downloadFile.bind(this)}
                    disabled={!fromPath}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {
  copyFileTo: a.copyFileTo,
  copyFileFrom: a.copyFileFrom
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnvVariablesView);
