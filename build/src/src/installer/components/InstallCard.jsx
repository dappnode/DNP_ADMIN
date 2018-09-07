import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as selector from "../selectors";
import { createStructuredSelector } from "reselect";
// Components
import ProgressLog from "./InstallCardComponents/ProgressLog";
import ApproveInstall from "./InstallCardComponents/ApproveInstall";

class InstallCardView extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object.isRequired,
    request: PropTypes.object.isRequired,
    isInstalling: PropTypes.object.isRequired,
    progressLog: PropTypes.object.isRequired
  };

  render() {
    const pkgProgressId = this.props.isInstalling[this.props.id];
    const progressLog = pkgProgressId
      ? this.props.progressLog[pkgProgressId]
      : null;
    // Three stages.
    // Stage 1. Approve installation details
    if (!progressLog) {
      return (
        <ApproveInstall
          id={this.props.id}
          manifest={this.props.manifest}
          request={this.props.request}
        />
      );
    }

    // Stage 2. Show installation progress
    if (progressLog) {
      return <ProgressLog progressLog={progressLog} />;
    }

    // Stage 3. Show success or failure message
    return <h4 className="card-title">Success!</h4>;
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  isInstalling: selector.isInstalling,
  progressLog: selector.progressLog
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallCardView);
