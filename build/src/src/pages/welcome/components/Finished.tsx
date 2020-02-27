import React from "react";
import circuitBoardSvg from "illustrations/circuit_board-slim.svg";
import Button from "components/Button";
import "./welcomeHome.scss";

export default function Finished({
  onNext,
  onBack
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="illustration">
        <img src={circuitBoardSvg} />
      </div>

      <div className="header">
        <div className="title">All set!</div>
        <div className="description">Ready to use your DAppNode</div>
      </div>

      <Button
        className="welcome-home-start"
        onClick={onNext}
        variant="dappnode"
      >
        Finish
      </Button>

      <div className="bottom-buttons">
        <Button onClick={onBack} variant="outline-secondary">
          Back
        </Button>
        {onNext && (
          <Button onClick={onNext} variant="dappnode">
            Next
          </Button>
        )}
      </div>
    </>
  );
}
