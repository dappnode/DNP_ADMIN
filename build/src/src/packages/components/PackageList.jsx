import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { connect } from "react-redux";
// Components
import PackageRow from "./PackageRow";
import Loading from "components/Loading";
import NoPackagesYet from "./NoPackagesYet";
// Styles
import "./packages.css";

const xnor = (a, b) => Boolean(a) === Boolean(b);

class PackagesList extends React.Component {
  static propTypes = {
    dnps: PropTypes.array.isRequired,
    moduleName: PropTypes.string.isRequired
  };

  render() {
    const dnps = this.props.dnps || [];
    if (this.props.fetching && !dnps.length) {
      return <Loading msg="Loading installed packages..." />;
    } else if (this.props.hasFetched && !dnps.length) {
      return <NoPackagesYet />;
    } else {
      return (
        (this.props.dnps || [])
          // XNOR operator, if coreDnps = true show only cores. If coreDnps = false, hide them
          .filter(dnp => xnor(this.props.coreDnps, dnp.isCore || dnp.isCORE))
          .map((dnp, i) => (
            <PackageRow key={i} dnp={dnp} moduleName={this.props.moduleName} />
          ))
      );
    }
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  dnps: selector.getPackages,
  fetching: selector.fetching,
  hasFetched: selector.hasFetched
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
