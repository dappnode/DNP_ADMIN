import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
import { NAME } from "../constants";
// Components
import PackageRow from "./PackageRow";
import Loading from "components/Loading";
// Styles
import "./packages.css";

class PackagesList extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="section-title" style={{ textTransform: "capitalize" }}>
          {NAME}
        </div>

        {this.props.fetching && (this.props.dnpPackages || []).length === 0 ? (
          <Loading msg="Loading installed packages..." />
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
  corePackages: selector.getCorePackages,
  dnpPackages: selector.getDnpPackages,
  fetching: selector.fetching
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
