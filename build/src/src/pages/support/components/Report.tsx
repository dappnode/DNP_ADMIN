import React, { useEffect } from "react";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import { connect } from "react-redux";
// Components
import Card from "components/Card";
// Actions
import { fetchAllDappnodeStatus } from "services/dappnodeStatus/actions";
// Icon
import Github from "Icons/Github";
// Styles
import "./support.css";
import RenderMarkdown from "components/RenderMarkdown";

function Report({
  issueBody,
  issueUrl,
  issueUrlRaw,
  fetchAllDappnodeStatus
}: {
  issueBody: string;
  issueUrl: string;
  issueUrlRaw: string;
  fetchAllDappnodeStatus: () => void;
}) {
  useEffect(() => {
    fetchAllDappnodeStatus(); // = componentDidMount
  }, [fetchAllDappnodeStatus]);

  return (
    <Card>
      <p>
        To help the support team, the <strong>Report issue</strong> button will
        prefill the Github issue with the information shown below. If you don't
        want to share any information, use the{" "}
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
      <div className="github-issue-body">
        <RenderMarkdown source={issueBody} />
      </div>
      <a className="btn btn-dappnode mt-3 mr-3" href={issueUrl}>
        Report issue
      </a>
      <a className="btn btn-outline-dappnode mt-3" href={issueUrlRaw}>
        Report issue without providing information
      </a>
    </Card>
  );
}

// Container

const mapStateToProps = createStructuredSelector({
  issueBody: s.getIssueBody,
  issueUrl: s.getIssueUrl,
  issueUrlRaw: s.getIssueUrlRaw
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { fetchAllDappnodeStatus };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Report);
