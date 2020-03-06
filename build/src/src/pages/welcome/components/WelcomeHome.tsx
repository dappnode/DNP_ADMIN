import React from "react";
import circuitBoardSvg from "illustrations/circuit_board-slim.svg";
import Button from "components/Button";
import "./welcomeHome.scss";
import BottomButtons from "./BottomButtons";

export default function WelcomeHome({
  onBack,
  onNext
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

      <BottomButtons onBack={onBack} onNext={onNext} />
    </>
  );
}
