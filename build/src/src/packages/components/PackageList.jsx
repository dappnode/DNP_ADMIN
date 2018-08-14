import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
// Components
import PackageRow from "./PackageRow";
// Styles
import "./packages.css";

class PackagesList extends React.Component {
  render() {
    return (
      <div className="body">
        <h1>Package manager</h1>
        <br />
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Version</th>
                <th>State</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {this.props.dnpPackages.map((pkg, i) => (
                <PackageRow key={i} pkg={pkg} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
