import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
import { updateCore } from "../actions";
import { NAME } from "../constants";
// Modules
import packages from "packages";
import installer from "installer";
// Components
import UpdateSystem from "./UpdateSystem";
import StaticIp from "./StaticIp";
// Styles
import "packages/components/packages.css";

const PackageList = packages.components.PackageList;

function findProgressLog(pkgName, progressLogs) {
  for (const logId of Object.keys(progressLogs)) {
    if (Object.keys(progressLogs[logId]).includes(pkgName)) {
      return progressLogs[logId];
    }
  }
}

class SystemHome extends React.Component {
  render() {
    const progressLog = findProgressLog(
      "core.dnp.dappnode.eth",
      this.props.progressLogs
    );

    return (
      <React.Fragment>
        <div className="section-title" style={{ textTransform: "capitalize" }}>
          {NAME}
        </div>

        {progressLog ? (
          <installer.components.ProgressLog
            progressLog={progressLog}
            subtitle={"Updating DAppNode..."}
          />
        ) : null}

        <UpdateSystem
          coreDeps={this.props.coreDeps}
          updateCore={this.props.updateCore}
        />

        <StaticIp
          staticIp={this.props.staticIp}
          setStaticIp={this.props.setStaticIp}
          updateStaticIp={this.props.updateStaticIp}
        />

        <div className="section-subtitle">Packages</div>
        <PackageList moduleName={NAME} coreDnps={true} />
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  coreDeps: selector.coreDeps,
  progressLogs: installer.selectors.progressLogs
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { updateCore };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemHome);
