import React from "react";
import ReactMarkdown from "react-markdown";
// Components
import Card from "components/Card";
import Button from "components/Button";
import StatusIcon from "components/StatusIcon";

export default function Permissions({ permissions, onAccept, goBack }) {
  /**
   * @param permissions = [{
   *   name: "Short description",
   *   details: "Long description of the capabilitites"
   * }, ... ]
   */

  // "Requires no special permissions"
  return (
    <Card className="permissions-list" spacing divider>
      {permissions.map(permission => (
        <div key={permission.name}>
          <strong>{permission.name}</strong>
          <div className="no-p-style" style={{ opacity: 0.6 }}>
            <ReactMarkdown source={permission.details} />
          </div>
        </div>
      ))}
      {permissions.length === 0 && (
        <StatusIcon success message={"Requires no special permissions"} />
      )}
      <div className="button-group">
        <Button onClick={goBack}>Back</Button>
        <Button variant="dappnode" onClick={onAccept}>
          {permissions.length === 0 ? "Next" : "Accept"}
        </Button>
      </div>
    </Card>
  );
}
