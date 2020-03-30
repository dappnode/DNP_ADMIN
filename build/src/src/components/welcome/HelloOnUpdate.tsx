import React from "react";
import Button from "components/Button";

export default function HelloNewFeature({
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
          Some new features require you attention
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
