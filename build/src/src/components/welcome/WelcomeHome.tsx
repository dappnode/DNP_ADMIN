import React from "react";
import Button from "components/Button";
import "./welcomeHome.scss";

export default function WelcomeHome({
  onNext
}: {
  onBack?: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="header">
        <div className="title">Configure your DAppNode</div>
        <div className="description">
          Welcome! You will configure your DAppNode
        </div>
      </div>

      <Button
        className="welcome-home-start"
        onClick={onNext}
        variant="dappnode"
      >
        Start
      </Button>
    </>
  );
}
