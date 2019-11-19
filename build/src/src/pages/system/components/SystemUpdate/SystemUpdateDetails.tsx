import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import DependencyList from "pages/installer/components/InstallCardComponents/DependencyList";
import ReactMarkdown from "react-markdown";
// Actions
import { updateCore } from "services/coreUpdate/actions";
// Selectors
import {
  getCoreDeps,
  getCoreUpdateAlerts,
  getCoreChangelog
} from "services/coreUpdate/selectors";
// Components
import Card from "components/Card";
import Button from "components/Button";
// Icons
import { FaArrowRight } from "react-icons/fa";
import { ManifestUpdateAlert, DependencyListItem } from "types";

const SystemUpdateDetails = ({
  coreDeps,
  coreUpdateAlerts,
  coreChangelog,
  updateCore
}: {
  coreDeps: DependencyListItem[];
  coreUpdateAlerts: ManifestUpdateAlert[];
  coreChangelog?: string;
  updateCore: () => void;
}) => {
  return (
    <Card className="system-update-grid" spacing>
      {coreChangelog && (
        <ReactMarkdown className="no-p-style" source={coreChangelog} />
      )}

      {coreUpdateAlerts.map(({ from, to, message }) => (
        <div
          key={from + to}
          className="alert alert-warning"
          style={{ margin: "12px 0 6px 0" }}
        >
          {/* If there are multiple alerts, display the update jump */}
          {coreUpdateAlerts.length > 1 && (
            <div style={{ fontWeight: "bold" }}>
              {from} <FaArrowRight style={{ fontSize: ".7rem" }} /> {to}
            </div>
          )}
          <ReactMarkdown source={message} />
        </div>
      ))}

      {/* Dedicated per core version update and warnings */}
      <DependencyList deps={coreDeps} />

      <Button variant="dappnode" onClick={updateCore}>
        Update
      </Button>
    </Card>
  );
};

// Container

const mapStateToProps = createStructuredSelector({
  coreDeps: getCoreDeps,
  coreUpdateAlerts: getCoreUpdateAlerts,
  coreChangelog: getCoreChangelog
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { updateCore };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemUpdateDetails);
