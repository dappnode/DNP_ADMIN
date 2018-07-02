import React from "react";
import { connect } from "react-redux";
import * as action from "../actions";
import { getItems } from "../selectors";
import { createStructuredSelector } from "reselect";

class DependenciesAlert extends React.Component {
  render() {
    let items = this.props.items || [{}];
    const alerts = this.props.deps
      .map(depName => items.find(e => e && e.id && e.id === depName))
      .filter(dep => dep && dep.status === -1)
      .map((dep, i) => {
        let type, msg;
        if (dep.status === -1) {
          type = "danger";
          msg = "Dependency error ";
        }
        if (dep.status === 0) {
          type = "warning";
          msg = "Dependency ";
        }
        return (
          <div key={i} className={"alert alert-" + type} role="alert">
            {msg}
            <strong>{dep.id + ": "}</strong>
            {dep.msg}
          </div>
        );
      });

    return <div>{alerts}</div>;
  }
}

const mapStateToProps = createStructuredSelector({
  items: getItems
});

const mapDispatchToProps = dispatch => {
  return {
    check: () => {
      dispatch(action.check());
    },
    init: () => {
      dispatch(action.init());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependenciesAlert);
