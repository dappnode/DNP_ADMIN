import React from "react";
import { connect } from "react-redux";
import * as s from "../selectors";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
// Components
import Details from "./PackageViews/Details";
import Logs from "./PackageViews/Logs";
import Envs from "./PackageViews/Envs";
import FileManager from "./PackageViews/FileManager";
import Controls from "./PackageViews/Controls";
import Loading from "components/generic/Loading";
import NoPackagesYet from "./NoPackagesYet";
import NoDnpInstalled from "./NoDnpInstalled";

const PackageInterface = ({ dnp, id, moduleName, areThereDnps }) => (
  <React.Fragment>
    <div className="section-title">
      <span className="pre-title">{moduleName} </span>
      {id}
    </div>
    {dnp ? (
      <React.Fragment>
        <Details dnp={dnp} />
        <Controls dnp={dnp} />
        <Envs dnp={dnp} />
        <FileManager dnp={dnp} />
        <Logs dnp={dnp} />
      </React.Fragment>
    ) : areThereDnps ? (
      <NoDnpInstalled id={id} moduleName={moduleName} />
    ) : null}
  </React.Fragment>
);

PackageInterface.propTypes = {
  dnp: PropTypes.object,
  id: PropTypes.string,
  moduleName: PropTypes.string.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  dnp: s.getDnp,
  // id and moduleName are parsed from the url at the selector (with the router state)
  id: s.getUrlId,
  moduleName: s.getModuleName,
  areThereDnps: s.areThereDnps
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageInterface);
