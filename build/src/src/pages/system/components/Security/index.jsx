import React from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
// Components
import SubTitle from "components/SubTitle";
import StatusCard from "components/StatusCard";
import SeverityBadge from "./SeverityBadge";
import ChangeHostUserPassword from "./ChangeHostUserPassword";
// External
import { getPasswordIsInsecure } from "services/dappnodeStatus/selectors";
// Style
import "./security.scss";

function SystemSecurity({ passwordIsInsecure }) {
  const securityIssues = [];
  if (passwordIsInsecure)
    securityIssues.push({
      name: "Change host user password",
      severity: "critical",
      component: ChangeHostUserPassword
    });

  const issues = securityIssues.length > 0;

  return (
    <>
      <StatusCard
        success={!issues}
        message={
          issues ? "Some issues require your attention" : "No issues found"
        }
      />

      {securityIssues.map(issue => (
        <React.Fragment key={issue.name}>
          <div className="security-issue-header">
            <SubTitle>{issue.name}</SubTitle>
            <SeverityBadge severity={issue.severity} />
          </div>
          <issue.component />
        </React.Fragment>
      ))}
    </>
  );
}

// Container

SystemSecurity.propTypes = {
  passwordIsInsecure: PropTypes.bool.isRequired
};

const mapStateToProps = createStructuredSelector({
  passwordIsInsecure: getPasswordIsInsecure
});

export default connect(
  mapStateToProps,
  null
)(SystemSecurity);
