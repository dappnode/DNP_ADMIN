import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import { connect } from "react-redux";
import { title } from "../data";
import marked from "marked";
// Components
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import Title from "components/Title";
// Actions
import { fetchAllDappnodeStatus } from "services/dappnodeStatus/actions";
// Icon
import Github from "Icons/Github";
import Ok from "components/Ok";
// Styles
import "./troubleshoot.css";

function TroubleshootHome({
  diagnoses,
  issueBody,
  issueUrl,
  issueUrlRaw,
  fetchAllDappnodeStatus
}) {
  useEffect(() => {
    fetchAllDappnodeStatus(); // = componentDidMount
  }, []);

  return (
    <>
      <Title>{title}</Title>

      {/* Auto diagnose section */}
      <SubTitle>Auto diagnose</SubTitle>
      <Card>
        {diagnoses.map(({ loading, ok, msg, solutions }, i) => (
          <div key={i}>
            <Ok {...{ msg, ok, loading }} />
            {!ok && !loading && solutions ? (
              <ul>
                {solutions.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </Card>

      {/* Report section */}
      <SubTitle>Report</SubTitle>

      <Card>
        <p>
          To help the support team, the <strong>Report issue</strong> button
          will prefill the Github issue with the information shown below. If you
          don't want to share any information, use the{" "}
          <strong>Report issue without providing information</strong> button.
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
            __html: marked(issueBody)
          }}
        />
        <a className="btn btn-dappnode mt-3 mr-3" href={issueUrl}>
          Report issue
        </a>
        <a className="btn btn-outline-dappnode mt-3" href={issueUrlRaw}>
          Report issue without providing information
        </a>
      </Card>
    </>
  );
}

TroubleshootHome.propTypes = {
  diagnoses: PropTypes.array.isRequired,
  issueBody: PropTypes.string.isRequired,
  issueUrl: PropTypes.string.isRequired,
  issueUrlRaw: PropTypes.string.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  issueBody: s.getIssueBody,
  issueUrl: s.getIssueUrl,
  issueUrlRaw: s.getIssueUrlRaw,
  diagnoses: s.getDiagnoses
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { fetchAllDappnodeStatus };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TroubleshootHome);
