import React from "react";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import * as action from "../actions";
import { connect } from "react-redux";
import { NAME } from "../constants";
// Styles
// import "./packages.css";

class PackagesList extends React.Component {
  componentWillMount() {
    this.props.diagnose();
  }
  render() {
    let content;
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
