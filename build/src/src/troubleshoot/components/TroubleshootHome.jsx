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

function statusToColor(status) {
  if (status === 1) return "#1ccec0";
  if (status === 0) return "#ffff00";
  if (status === -1) return "#ff0000";
}
function statusToIcon(status) {
  if (status === 1) return "✓";
  if (status === 0) return "⚠";
  if (status === -1) return "✕";
}

class PackagesList extends React.Component {
  componentWillMount() {
    this.props.diagnose();
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

        <div className="border-bottom mb-4">
          <div className="section-subtitle">Diagnose</div>
          <div className="card mb-4">
            <div className="card-body">
              {this.props.diagnoses.map(({ ok, msg, solution = [] }, i) => (
                <div key={i}>
                  <div>
                    <span
                      style={{
                        color: ok ? "#1ccec0" : "#ff0000",
                        fontWeight: 800
                      }}
                    >
                      {ok ? "✓" : "✕"}
                    </span>{" "}
                    {msg}
                  </div>
                  {ok ? null : <ul>{solution.map(item => <li>{item}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <a className="btn dappnode-background-color" href={this.props.issueUrl}>
          Report issue
        </a>
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  issueUrl: selector.issueUrl,
  diagnoses: selector.diagnoses
});

const mapDispatchToProps = dispatch => {
  return {
    diagnose: () => {
      dispatch(action.diagnose());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagesList);
