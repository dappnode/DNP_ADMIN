import React, { useEffect } from "react";
import * as s from "../selectors";
import { useSelector, useDispatch } from "react-redux";
// Components
import Card from "components/Card";
// Actions
import { fetchAllDappnodeStatus } from "services/dappnodeStatus/actions";
// Icon
import Github from "Icons/Github";
// Styles
import "./support.css";
import RenderMarkdown from "components/RenderMarkdown";

export default function Report() {
  const issueBody = useSelector(s.getIssueBody);
  const issueUrl = useSelector(s.getIssueUrl);
  const issueUrlRaw = useSelector(s.getIssueUrlRaw);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllDappnodeStatus());
  }, [dispatch]);

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
