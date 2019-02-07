import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
import { NAME } from "../constants";
// Components
import PackageRow from "./PackageRow";
import Loading from "components/Loading";
import NoPackagesYet from "./NoPackagesYet";
import UpdatePackages from "./UpdatePackages";
// Styles
import "./packages.css";

class PackagesList extends React.Component {
  render() {
    const dnpPackages = this.props.dnpPackages || [];
    return (
      <React.Fragment>
        <div className="section-title" style={{ textTransform: "capitalize" }}>
          {NAME}
        </div>

        <UpdatePackages />

        {this.props.fetching && !dnpPackages.length ? (
          <Loading msg="Loading installed packages..." />
        ) : this.props.hasFetched && !dnpPackages.length ? (
          <NoPackagesYet />
        ) : (
          (this.props.dnpPackages || []).map((pkg, i) => (
            <PackageRow key={i} pkg={pkg} moduleName={NAME} />
          ))
        )}
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  dnpPackages: selector.getDnpPackages,
  fetching: selector.fetching,
  hasFetched: selector.hasFetched
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
