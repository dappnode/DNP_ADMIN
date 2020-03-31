import React from "react";
import Button from "components/Button";

export default function HelloFirstTime({
  onNext
}: {
  onBack?: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="header">
        <div className="title">Welcome to your DAppNode</div>
        <div className="description">
          Let's get started with the configuration
          {/* <br />
          If you want,{" "}
          <a href={surveyUrl} {...newTabProps}>
            leave your feeback{" "}
          </a>
          on how the installation went. */}
        </div>
      </div>

      <Button
        className="big-centered-button"
        onClick={onNext}
        variant="dappnode"
      >
        Start
      </Button>
    </>
  );
}
