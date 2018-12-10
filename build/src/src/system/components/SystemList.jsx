import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { NAME } from "../constants";
// Components
import SystemRow from "./SystemRow";
import UpdateSystem from "./UpdateSystem";
import StaticIp from "./StaticIp";
import installer from "installer";
import Loading from "components/Loading";
// Styles
import "packages/components/packages.css";

function findProgressLog(pkgName, progressLogs) {
  for (const logId of Object.keys(progressLogs)) {
    if (Object.keys(progressLogs[logId]).includes(pkgName)) {
      return progressLogs[logId];
    }
  }
}

class SystemList extends React.Component {
  render() {
    const progressLog = findProgressLog(
      "core.dnp.dappnode.eth",
      this.props.progressLogs
    );
    // Don't show "core.dnp.dappnode.eth" actual progress log information
    delete (progressLog || {})["core.dnp.dappnode.eth"];

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

        {this.props.fetching && (this.props.corePackages || []).length === 0 ? (
          <Loading msg="Loading core packages..." />
        ) : (
          (this.props.corePackages || []).map((pkg, i) => (
            <SystemRow key={i} pkg={pkg} moduleName={NAME} />
          ))
        )}
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  corePackages: selector.getCorePackages,
  coreDeps: selector.coreDeps,
  progressLogs: installer.selectors.progressLogs,
  fetching: selector.fetching
});

const mapDispatchToProps = dispatch => {
  return {
    updateCore: () => {
      dispatch(action.updateCore());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemList);
