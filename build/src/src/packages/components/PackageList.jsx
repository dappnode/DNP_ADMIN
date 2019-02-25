import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import { connect } from "react-redux";
// Components
import PackageRow from "./PackageRow";
import Loading from "components/Loading";
import NoPackagesYet from "./NoPackagesYet";
// Styles
import "./packages.css";

const xnor = (a, b) => Boolean(a) === Boolean(b);

const PackagesList = ({
  dnps = [],
  moduleName,
  fetching,
  hasFetched,
  coreDnps
}) => {
  if (fetching && !dnps.length) {
    return <Loading msg="Loading installed packages..." />;
  } else if (hasFetched && !dnps.length) {
    return <NoPackagesYet />;
  } else {
    return (
      (dnps || [])
        // XNOR operator, if coreDnps = true show only cores. If coreDnps = false, hide them
        .filter(dnp => xnor(coreDnps, dnp.isCore || dnp.isCORE))
        .map((dnp, i) => (
          <PackageRow key={i} dnp={dnp} moduleName={moduleName} />
        ))
    );
  }
};

PackagesList.propTypes = {
  dnps: PropTypes.array.isRequired,
  moduleName: PropTypes.string.isRequired,
  fetching: PropTypes.bool.isRequired,
  hasFetched: PropTypes.bool.isRequired,
  coreDnps: PropTypes.bool
};

// Container

const mapStateToProps = createStructuredSelector({
  dnps: s.getFilteredPackages,
  fetching: s.fetching,
  hasFetched: s.hasFetched
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
