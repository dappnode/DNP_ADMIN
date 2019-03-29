import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import { connect } from "react-redux";
// Components
import PackageRow from "./PackageRow";
import Loading from "components/generic/Loading";
import NoPackagesYet from "./NoPackagesYet";
// Styles
import "./packages.css";

const xnor = (a, b) => Boolean(a) === Boolean(b);

const PackagesList = ({ dnps = [], moduleName, coreDnps }) => {
  if (!dnps.length) {
    return <NoPackagesYet />;
  } else {
    return (
      (dnps || [])
        // XNOR operator, if coreDnps = true show only cores. If coreDnps = false, hide them
        .filter(dnp => xnor(coreDnps, dnp.isCore || dnp.isCORE))
        .map((dnp, i) => (
          <PackageRow key={dnp.name || i} dnp={dnp} moduleName={moduleName} />
        ))
    );
  }
};

PackagesList.propTypes = {
  dnps: PropTypes.array.isRequired,
  moduleName: PropTypes.string.isRequired,
  coreDnps: PropTypes.bool
};

// Container

const mapStateToProps = createStructuredSelector({
  dnps: s.getFilteredPackages
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
