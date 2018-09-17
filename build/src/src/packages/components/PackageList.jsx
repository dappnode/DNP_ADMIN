import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
import { NAME } from "../constants";
// Components
import PackageRow from "./PackageRow";
// Styles
import "./packages.css";

class PackagesList extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="section-title" style={{ textTransform: "capitalize" }}>
          {NAME}
        </div>

        {(this.props.dnpPackages || []).map((pkg, i) => (
          <PackageRow key={i} pkg={pkg} moduleName={NAME} />
        ))}
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  corePackages: selector.getCorePackages,
  dnpPackages: selector.getDnpPackages
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
