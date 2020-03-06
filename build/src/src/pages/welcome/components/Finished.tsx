import React from "react";
import circuitBoardSvg from "illustrations/circuit_board-slim.svg";
import Button from "components/Button";
import "./welcomeHome.scss";
import BottomButtons from "./BottomButtons";

export default function Finished({
  onBack,
  onNext
}: {
  onBack: () => void;
  onNext?: () => void;
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

      <BottomButtons onBack={onBack} onNext={onNext} />
    </>
  );
}
