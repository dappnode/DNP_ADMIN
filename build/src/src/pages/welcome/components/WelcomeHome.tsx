import React from "react";
import circuitBoardSvg from "illustrations/circuit_board-slim.svg";
import Button from "components/Button";
import "./welcomeHome.scss";

export default function WelcomeHome({
  onNext,
  onBack
}: {
  onBack?: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="illustration">
        <img src={circuitBoardSvg} />
      </div>

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

      <div className="bottom-buttons">
        {onNext && (
          <Button onClick={onNext} variant="dappnode">
            Next
          </Button>
        )}
      </div>
    </>
  );
}
