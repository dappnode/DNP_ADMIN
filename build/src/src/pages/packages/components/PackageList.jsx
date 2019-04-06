import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import * as a from "../actions";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// Components
import NoPackagesYet from "./NoPackagesYet";
import StateBadge from "./PackageViews/StateBadge";
import Card from "components/Card";
// Utils
import confirmRestartPackage from "./confirmRestartPackage";
// Icons
import { MdRefresh, MdOpenInNew } from "react-icons/md";
// Styles
import "./packages.css";

const xnor = (a, b) => Boolean(a) === Boolean(b);

const PackagesList = ({ dnps = [], restartPackage, moduleName, coreDnps }) => {
  if (!dnps.length) return <NoPackagesYet />;

  return (
    <Card className="list-grid dnps no-a-style">
      <header className="center">Status</header>
      <header>Name</header>
      <header>Open</header>
      <header>Restart</header>
      {dnps
        .filter(dnp => xnor(coreDnps, dnp.isCore || dnp.isCORE))
        .map(({ name, state }) => (
          <React.Fragment key={name}>
            <StateBadge state={state} />
            <NavLink className="name" to={`/${moduleName}/${name}`}>
              {name}
            </NavLink>
            <NavLink className="open" to={`/${moduleName}/${name}`}>
              <MdOpenInNew />
            </NavLink>
            <MdRefresh
              onClick={() => confirmRestartPackage(name, restartPackage)}
            />
            <hr />
          </React.Fragment>
        ))}
    </Card>
  );
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

const mapDispatchToProps = {
  restartPackage: a.restartPackage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
