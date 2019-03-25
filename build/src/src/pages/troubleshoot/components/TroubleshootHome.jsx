import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import { diagnose } from "../actions";
import { connect } from "react-redux";
import { title } from "../data";
import marked from "marked";
// Icon
import Github from "Icons/Github";
// Styles
import "./troubleshoot.css";

class TroubleshootHome extends React.Component {
  static propTypes = {
    diagnoses: PropTypes.array.isRequired
  };

  componentWillMount() {
    this.props.diagnose();
  }
  render() {
    let content;
    return (
      <React.Fragment>
        <div className="section-title">{title}</div>
        {content}

        <div className="border-bottom mb-4">
          <div className="section-subtitle">Auto diagnose</div>
          <div className="card mb-4">
            <div className="card-body">
              {this.props.diagnoses.map(({ ok, msg, solutions }, i) => (
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
                  {!ok && solutions ? (
                    <ul>
                      {solutions.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className="section-subtitle">Report</div>
          <div className="card mb-4">
            <div className="card-body">
              <p>
                To help the support team, the <strong>Report issue</strong>{" "}
                button will prefill the Github issue with the information shown
                below. If you don't want to share any information, use the{" "}
                <strong>Report issue without providing information</strong>{" "}
                button.
              </p>

              <div className="github-issue-header">
                <span className="github-issue-logo">
                  <Github scale={0.05} />
                </span>
                <span className="github-issue-arrow">></span>
                <span>New issue</span>
                <span className="github-issue-arrow">></span>
                <span>Body</span>
              </div>
              <div
                className="github-issue-body"
                dangerouslySetInnerHTML={{
                  __html: marked(this.props.issueBody)
                }}
              />
              <a
                className="btn btn-dappnode mt-3 mr-3"
                href={this.props.issueUrl}
              >
                Report issue
              </a>
              <a
                className="btn btn-outline-dappnode mt-3"
                href={this.props.issueUrlRaw}
              >
                Report issue without providing information
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// Container

const mapStateToProps = createStructuredSelector({
  issueBody: selector.getIssueBody,
  issueUrl: selector.getIssueUrl,
  issueUrlRaw: selector.getIssueUrlRaw,
  diagnoses: selector.getDiagnoses
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { diagnose };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TroubleshootHome);
