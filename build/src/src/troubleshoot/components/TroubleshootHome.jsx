import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import * as action from "../actions";
import { connect } from "react-redux";
import { NAME } from "../constants";
// Components
import Loading from "components/Loading";
// Styles
// import "./packages.css";

class PackagesList extends React.Component {
  componentWillMount() {
    this.props.computeIssueUrl();
  }
  render() {
    let content;
    if (false) {
      content = <Loading msg="Loading installed packages..." />;
    }
    return (
      <React.Fragment>
        <div className="section-title" style={{ textTransform: "capitalize" }}>
          {NAME}
        </div>
        {content}

        <a className="btn dappnode-background-color" href={this.props.issueUrl}>
          Report issue
        </a>
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  issueUrl: selector.issueUrl
});

const mapDispatchToProps = dispatch => {
  return {
    computeIssueUrl: () => {
      dispatch(action.computeIssueUrl());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
