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
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
// Selectors
import {
  getIsLoading,
  getLoadingError
} from "services/loadingStatus/selectors";
// Icons
import { MdRefresh, MdOpenInNew } from "react-icons/md";
// Utils
import sortByProp from "utils/sortByProp";
// Images
import defaultAvatar from "img/defaultAvatar.png";
import dappnodeIcon from "img/dappnode-logo-only.png";

const xnor = (a, b) => Boolean(a) === Boolean(b);

const PackagesList = ({
  dnps = [],
  moduleName,
  coreDnps,
  dnpsAvatars,
  loading,
  error,
  restartPackage
}) => {
  if (!dnps.length) {
    if (loading)
      return <Loading msg="Loading installed DAppNode Packages..." />;
    if (error)
      return (
        <Error msg={`Error loading installed DAppNode Packages: ${error}`} />
      );
  }

  const filteredDnps = dnps.filter(dnp => xnor(coreDnps, dnp.isCore));
  if (!filteredDnps.length) return <NoPackagesYet />;

  const modulePath = moduleName.toLowerCase();

  return (
    <Card className={`list-grid dnps no-a-style`}>
      <header className="center"> </header>
      <header className="center">Status</header>
      <header>Name</header>
      <header>Open</header>
      <header>Restart</header>
      {filteredDnps.sort(sortByProp("name")).map(({ name, state }) => (
        <React.Fragment key={name}>
          <img
            className="avatar"
            src={dnpsAvatars[name] || (coreDnps ? dappnodeIcon : defaultAvatar)}
            alt="Avatar"
          />
          <StateBadge state={state} />
          <NavLink className="name" to={`/${modulePath}/${name}`}>
            {name}
          </NavLink>
          <NavLink className="open" to={`/${modulePath}/${name}`}>
            <MdOpenInNew />
          </NavLink>
          <MdRefresh
            style={{ fontSize: "1.05rem" }}
            onClick={() => restartPackage(name)}
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
  coreDnps: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  dnps: s.getFilteredPackages,
  dnpsAvatars: s.getPackagesAvatars,
  loading: getIsLoading.dnpInstalled,
  error: getLoadingError.dnpInstalled
});

const mapDispatchToProps = {
  restartPackage: a.restartPackage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
