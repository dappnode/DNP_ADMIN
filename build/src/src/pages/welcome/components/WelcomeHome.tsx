import React from "react";
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
      <div className="header">
        <div className="title">Hello nodler</div>
        <div className="description">Let's configure your DAppNode</div>
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
