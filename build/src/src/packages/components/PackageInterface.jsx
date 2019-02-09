import React from "react";
import * as selector from "../selectors";
import { connect } from "react-redux";
import * as action from "../actions";
import { push } from "connected-react-router";
import { NAME } from "../constants";
// Components
import Details from "./PackageViews/Details";
import Logs from "./PackageViews/Logs";
import Envs from "./PackageViews/Envs";
import Controls from "./PackageViews/Controls";
import Loading from "components/Loading";
import Error from "components/Error";
import NoPackagesYet from "./NoPackagesYet";
// utils
import parsePorts from "utils/parsePorts";

class PackageInterface extends React.Component {
  render() {
    const dnp = this.props.dnp;

    return (
      <React.Fragment>
        <div className="section-title">
          <span className="pre-title">{NAME} </span>
          {this.props.match.params.id}
        </div>
        {dnp ? (
          <React.Fragment>
            <Details dnp={dnp} />
            <Logs dnp={dnp} />
            <Envs dnp={dnp} />
            <Controls dnp={dnp} />
          </React.Fragment>
        ) : this.props.fetching ? (
          <Loading msg="Loading installed packages..." />
        ) : this.props.hasFetched ? (
          <NoPackagesYet />
        ) : (
          <Error msg="Broken connection or unknown state" />
        )}
      </React.Fragment>
    );
  }
}

// Container
// createSelector(a, b, c, (ax, bx, cx) => ({a: ax, b: bx: c: cx})
// =
// createStructuredSelector({a, b, c})

const mapStateToProps = (state, ownProps) => {
  return {
    fetching: selector.fetching(state),
    dnp: selector.getDnp(state, ownProps.match.params.id)
  };
};

const mapDispatchToProps = {
  togglePackage: action.togglePackage,
  restartPackage: action.restartPackage,
  restartPackageVolumes: action.restartPackageVolumes,
  removePackage: action.removePackage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackageInterface);
