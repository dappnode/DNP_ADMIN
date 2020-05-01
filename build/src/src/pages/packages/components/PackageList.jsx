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
import { getDnpInstalledStatus } from "services/dnpInstalled/selectors";
// Icons
import { MdRefresh, MdOpenInNew } from "react-icons/md";
// Utils
import { shortNameCapitalized } from "utils/format";
import { sortBy } from "lodash";
// Images
import defaultAvatar from "img/defaultAvatar.png";
import dappnodeIcon from "img/dappnode-logo-only.png";

const xnor = (a, b) => Boolean(a) === Boolean(b);

const PackagesList = ({
  dnps = [],
  moduleName,
  coreDnps,
  requestStatus: { loading, error },
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
      <header className="center">Status</header>
      <header className="center"> </header>
      <header>Name</header>
      <header>Open</header>
      <header className="restart">Restart</header>
      {sortBy(filteredDnps, pkg => pkg.name).map(
        ({ name, state, avatarUrl }) => (
          <React.Fragment key={name}>
            <StateBadge state={state} />
            <img
              className="avatar"
              src={avatarUrl || (coreDnps ? dappnodeIcon : defaultAvatar)}
              alt="Avatar"
            />
            <NavLink className="name" to={`/${modulePath}/${name}`}>
              {shortNameCapitalized(name)}
            </NavLink>
            <NavLink className="open" to={`/${modulePath}/${name}`}>
              <MdOpenInNew />
            </NavLink>
            <MdRefresh
              className="restart"
              style={{ fontSize: "1.05rem" }}
              onClick={() => restartPackage(name)}
            />
            <hr />
          </React.Fragment>
        )
      )}
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
  dnps: s.getFilteredPackages,
  requestStatus: getDnpInstalledStatus,
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
