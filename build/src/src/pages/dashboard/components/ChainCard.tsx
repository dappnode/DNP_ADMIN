import React from "react";
import Card from "components/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import RenderMarkdown from "components/RenderMarkdown";
import newTabProps from "utils/newTabProps";
import { MdHelpOutline } from "react-icons/md";

export default function ChainCard({
  name,
  message,
  help,
  progress,
  error,
  syncing
}: {
  name: string;
  message: string;
  help?: string;
  progress?: number;
  error: boolean;
  syncing: boolean;
}) {
  return (
    <Card className="chain-card">
      <div className="name">
        <span className="text">{name}</span>
        {help && (
          <a className="help" href={help} {...newTabProps}>
            <MdHelpOutline />
          </a>
        )}
      </div>

      {syncing ? (
        typeof progress === "number" && (
          <ProgressBar
            now={progress * 100}
            animated={true}
            label={`${Math.floor(progress * 100)}%`}
          />
        )
      ) : error ? (
        <ProgressBar now={100} variant="danger" />
      ) : (
        <ProgressBar now={100} variant="success" />
      )}

      <div className="message">
        <RenderMarkdown source={message} noMargin />
      </div>
    </Card>
  );
}
