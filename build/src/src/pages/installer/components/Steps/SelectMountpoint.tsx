import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Dropdown from "react-bootstrap/Dropdown";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "components/Button";
import { MdHome, MdRefresh } from "react-icons/md";
import "./selectMountpoint.scss";
import { joinCssClass } from "utils/css";
import { MountpointData } from "types";
import { getIsLoadingStrict } from "services/loadingStatus/selectors";
import { getMountpoints } from "services/dappnodeStatus/selectors";
import { fetchMountpoints } from "services/dappnodeStatus/actions";

function SelectMountpoint({
  // React JSON form data props
  value,
  onChange,
  options,
  // Own DAppNode props from redux
  mountpoints,
  isLoading,
  fetchMountpoints
}: {
  value: string;
  onChange: (value: string) => void;
  options?: {
    alreadySet?: boolean;
    isLegacy?: boolean;
    prevPath?: string;
  };
  // Own DAppNode props from redux
  mountpoints: MountpointData[] | null;
  isLoading: boolean;
  fetchMountpoints: () => {};
}) {
  const [showHelp, setShowHelp] = useState(false);

  const { alreadySet, isLegacy, prevPath } = options || {};
  const selectedDev = (mountpoints || []).find(
    ({ mountpoint }) => mountpoint === value
  );

  // Automatically fetch mountpoints on component load
  useEffect(() => {
    if (!mountpoints) fetchMountpoints();
  }, [mountpoints, fetchMountpoints]);

  // If the user has selected an invalid mountpoint and is not loading or already set,
  // reset the value to the host (default) to prevent problems
  useEffect(() => {
    if (value && !selectedDev && !alreadySet && !isLoading) onChange("");
  }, [value, selectedDev, alreadySet, isLoading, onChange]);

  async function onSelectMountpoint(mountpoint: string) {
    if (isLegacy || alreadySet) return;
    onChange(mountpoint);
  }

  function renderSummary({
    mountpoint,
    vendor,
    total,
    model
  }: {
    mountpoint: string;
    vendor: string;
    total: string;
    model: string;
  }) {
    if (!mountpoint)
      return (
        <>
          <span>Host</span>
          {total && <span>{total}</span>}
          <small>(default)</small>
        </>
      );
    if (!vendor && !model)
      return (
        <>
          <span>{mountpoint}</span>
          {total && <span>{total}</span>}
        </>
      );
    return (
      <>
        <span>{vendor || model}</span>
        {total && <span>{total}</span>}
        <small>{model}</small>
      </>
    );
  }

  return (
    <>
      <div
        className="display-mountpoints"
        onClick={alreadySet && !showHelp ? () => setShowHelp(true) : undefined}
      >
        <Dropdown drop="down" id="select-mountpoint">
          <Dropdown.Toggle
            variant="outline-secondary"
            id="dropdown-basic"
            disabled={alreadySet}
          >
            <div className="info top">
              {isLegacy ? (
                <>
                  <span>{prevPath}</span>
                  <small>(legacy)</small>
                </>
              ) : selectedDev ? (
                renderSummary(selectedDev)
              ) : alreadySet ? (
                <>
                  <span>{prevPath}</span>
                  <small>(unknown device)</small>
                </>
              ) : isLoading ? (
                <span>Loading...</span>
              ) : (
                <span>Select drive</span>
              )}
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {(mountpoints || []).map(
              ({ mountpoint, vendor, model, total, use, free }) => (
                <Dropdown.Item
                  key={mountpoint}
                  onClick={() => onSelectMountpoint(mountpoint)}
                >
                  <div className="info top">
                    {!mountpoint && (
                      <span className="host">
                        <MdHome />
                      </span>
                    )}
                    {renderSummary({ mountpoint, vendor, model, total })}
                  </div>
                  <div className="info bottom">
                    <ProgressBar
                      className="use"
                      now={parseInt(use)}
                      label={use}
                    />
                    <span className="free">{free}</span>
                    <span className="mountpoint">{mountpoint}</span>
                  </div>
                </Dropdown.Item>
              )
            )}
          </Dropdown.Menu>
        </Dropdown>

        {!alreadySet && (
          <Button
            onClick={fetchMountpoints}
            disabled={isLoading}
            className={"refresh " + joinCssClass({ loading: isLoading })}
          >
            <MdRefresh />
            <span className="text">Refresh</span>
          </Button>
        )}
      </div>

      {showHelp && (
        <p className="change-mountpoint-help">
          Existing volumes can't be changed. To do so, unistall this package and
          remove its data
        </p>
      )}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  mountpoints: getMountpoints,
  isLoading: getIsLoadingStrict.mountpoints
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  fetchMountpoints
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectMountpoint);
