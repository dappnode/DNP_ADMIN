import React from "react";
import { connect } from "react-redux";
import * as s from "../selectors";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
// Components
import Details from "./PackageViews/Details";
import DnpSpecific from "./PackageViews/DnpSpecific";
import Logs from "./PackageViews/Logs";
import Envs from "./PackageViews/Envs";
import FileManager from "./PackageViews/FileManager";
import Controls from "./PackageViews/Controls";
import NoDnpInstalled from "./NoDnpInstalled";
// Components
import Title from "components/Title";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// Selectors
import {
  getIsLoading,
  getLoadingError
} from "services/loadingStatus/selectors";

const PackageInterface = ({
  dnp,
  id,
  moduleName,
  areThereDnps,
  loading,
  error
}) => (
  <>
    <Title title={moduleName} subtitle={id} />

    {dnp ? (
      <>
        <Details dnp={dnp} />
        <DnpSpecific dnp={dnp} />
        <Controls dnp={dnp} />
        <Envs dnp={dnp} />
        <FileManager dnp={dnp} />
        <Logs id={dnp.name} />
      </>
    ) : loading ? (
      <Loading msg="Loading installed DNPs..." />
    ) : error ? (
      <Error msg={`Error loading installed DNPs: ${error}`} />
    ) : areThereDnps ? (
      <NoDnpInstalled id={id} moduleName={moduleName} />
    ) : null}
  </>
);

PackageInterface.propTypes = {
  dnp: PropTypes.object,
  id: PropTypes.string,
  moduleName: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  dnp: s.getDnp,
  // id and moduleName are parsed from the url at the selector (with the router state)
  id: s.getUrlId,
  moduleName: s.getModuleName,
  areThereDnps: s.areThereDnps,
  loadingDnps: getIsLoading.dnpInstalled,
  loading: getIsLoading.dnpInstalled,
  error: getLoadingError.dnpInstalled
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageInterface);
