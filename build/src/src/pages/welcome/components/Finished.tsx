import React from "react";
import circuitBoardSvg from "illustrations/circuit_board-slim.svg";
import Button from "components/Button";
import "./welcomeHome.scss";
import BottomButtons from "./BottomButtons";
import newTabProps from "utils/newTabProps";

const userGuideUrl = "https://dappnode.github.io/DAppNodeDocs/what-can-you-do/";
const surveyUrl = "https://goo.gl/forms/DSy1J1OlQGpdyhD22";

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

        <p className="description">
          Visit the user guide to get an overview of how you can do with your
          DAppNode. Also, if you have just finished the installation, please let
          us know how it went; your feedback helps us to improve.
        </p>

        <p className="lead">
          <a
            className="btn btn-dappnode"
            href={userGuideUrl}
            role="button"
            {...newTabProps}
          >
            Read user guide
          </a>

          <a
            className="btn btn-outline-dappnode"
            href={surveyUrl}
            role="button"
            {...newTabProps}
          >
            Give feedback
          </a>
        </p>
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
