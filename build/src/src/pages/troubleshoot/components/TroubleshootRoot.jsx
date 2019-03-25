import React from "react";
import { Route } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { rootPath } from "../data";
// Components
import TroubleshootHome from "./TroubleshootHome";
// Logic

class TroubleshootRoot extends React.Component {
  render() {
    return (
      <div>
        <Route exact path={rootPath} component={TroubleshootHome} />
        <Route path={rootPath + "/:id"} component={null} />
      </div>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TroubleshootRoot);
