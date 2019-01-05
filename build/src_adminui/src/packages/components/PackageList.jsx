import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
import { NAME } from "../constants";
// Components
import PackageRow from "./PackageRow";
import Loading from "components/Loading";
import NoPackagesYet from "./NoPackagesYet";
// Styles
import "./packages.css";

class PackagesList extends React.Component {
  render() {
    const dnpPackages = this.props.dnpPackages || [];
    let content;
    if (this.props.fetching && !dnpPackages.length) {
      content = <Loading msg="Loading installed packages..." />;
    } else if (this.props.hasFetched && !dnpPackages.length) {
      content = <NoPackagesYet />;
    } else {
      content = (this.props.dnpPackages || []).map((pkg, i) => (
        <PackageRow key={i} pkg={pkg} moduleName={NAME} />
      ));
    }
    return (
      <React.Fragment>
        <div className="section-title" style={{ textTransform: "capitalize" }}>
          {NAME}
        </div>
        {content}
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  corePackages: selector.getCorePackages,
  dnpPackages: selector.getDnpPackages,
  fetching: selector.fetching,
  hasFetched: selector.hasFetched
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
