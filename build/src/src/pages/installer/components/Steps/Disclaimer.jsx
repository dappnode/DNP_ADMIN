import React from "react";
import ReactMarkdown from "react-markdown";
// Components
import Card from "components/Card";
import Button from "components/Button";
import StatusIcon from "components/StatusIcon";

export default function Disclaimer({ disclaimers, onAccept, goBack }) {
  /**
   * @param disclaimers = [{
   *   name: "Package disclaimer"
   *   message: "Some markdown text",
   */

  return (
    <Card spacing divider>
      {disclaimers.map(disclaimer => (
        <div key={disclaimer.name}>
          <strong>{disclaimer.name} disclaimer</strong>
          <div className="no-p-style">
            <ReactMarkdown source={disclaimer.message} />
          </div>
        </div>
      ))}

      {disclaimers.length === 0 && (
        <StatusIcon success message={"Requires no special permissions"} />
      )}

      <div className="button-group">
        <Button onClick={goBack}>Back</Button>
        <Button variant="dappnode" onClick={onAccept}>
          {disclaimers.length === 0 ? "Next" : "Accept"}
        </Button>
      </div>
    </Card>
  );
}
