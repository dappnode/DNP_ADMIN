import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Dropdown from "react-bootstrap/Dropdown";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "components/Button";
import { prettyBytes } from "utils/format";
import { MdHome, MdRefresh } from "react-icons/md";
import "./selectMountpoint.scss";
import { joinCssClass } from "utils/css";
import { MountpointData } from "types";
import {
  getIsLoadingStrict,
  getLoadingError
} from "services/loadingStatus/selectors";
import { getMountpoints } from "services/dappnodeStatus/selectors";
import { fetchMountpoints } from "services/dappnodeStatus/actions";
import newTabProps from "utils/newTabProps";

export const selectMountpointId = "selectMountpoint";
const troubleshootUrl =
  "https://github.com/dappnode/DAppNode/wiki/Troubleshoot-mountpoints";

function renderMountpointDataSummary({
  mountpoint,
  vendor,
  total,
  model
}: {
  mountpoint: string;
  vendor: string;
  total: number;
  model: string;
}) {
  const totalView = total && <span>{prettyBytes(total)}</span>;
  if (!mountpoint)
    return (
      <>
        <span>Host</span>
        {totalView}
        <small>(default)</small>
      </>
    );
  if (!vendor && !model)
    return (
      <>
        <span>{mountpoint}</span>
        {totalView}
      </>
    );
  return (
    <>
      <span>{vendor || model}</span>
      {totalView}
      <small>{model}</small>
    </>
  );
}

export function MountpointDataView({
  fileSystem
}: {
  fileSystem: MountpointData;
}) {
  const { mountpoint, vendor, model, total, use, free } = fileSystem;
  return (
    <div className="mountpoint-view">
      <div className="info top">
        {!mountpoint && (
          <span className="host">
            <MdHome />
          </span>
        )}
        {renderMountpointDataSummary({ mountpoint, vendor, model, total })}
      </div>
      <div className="info bottom">
        <ProgressBar className="use" now={parseInt(use)} label={use} />
        <span className="free">{prettyBytes(free)}</span>
        <span className="mountpoint">{mountpoint}</span>
      </div>
    </div>
  );
}

function SelectMountpoint({
  // React JSON form data props
  value,
  onChange,
  options,
  // Own DAppNode props from redux
  mountpoints: mountpointsApi,
  isLoading,
  loadingError,
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
  loadingError?: string;
  fetchMountpoints: () => {};
}) {
  const [showHelp, setShowHelp] = useState(false);

  const mountpointsLoaded = Boolean(mountpointsApi);
  const mountpoints: MountpointData[] = mountpointsApi || [
    {
      mountpoint: "",
      vendor: "Host",
      model: "(default)",
      use: "",
      used: 0,
      total: 0,
      free: 0
    }
  ];

  const { alreadySet, isLegacy, prevPath } = options || {};
  const selectedMountpoint = mountpoints.find(
    ({ mountpoint }) => mountpoint === value
  );

  // Automatically fetch mountpoints on component load
  useEffect(() => {
    if (!mountpointsLoaded) fetchMountpoints();
  }, [mountpointsLoaded, fetchMountpoints]);

  // If the user has selected an invalid mountpoint and is not loading or already set,
  // reset the value to the host (default) to prevent problems
  useEffect(() => {
    if (value && !selectedMountpoint && !alreadySet && !isLoading) onChange("");
  }, [value, selectedMountpoint, alreadySet, isLoading, onChange]);

  async function onSelectMountpoint(mountpoint: string) {
    if (isLegacy || alreadySet) return;
    onChange(mountpoint);
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
            className="mountpoint-view"
          >
            <div className="info top">
              {isLegacy ? (
                <>
                  <span>{prevPath}</span>
                  <small>(legacy)</small>
                </>
              ) : selectedMountpoint ? (
                renderMountpointDataSummary(selectedMountpoint)
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
            {mountpoints.map(fileSystem => (
              <Dropdown.Item
                key={fileSystem.mountpoint}
                onClick={() => onSelectMountpoint(fileSystem.mountpoint)}
              >
                <MountpointDataView fileSystem={fileSystem} />
              </Dropdown.Item>
            ))}

            {isLoading && !mountpointsLoaded && (
              <Dropdown.Item>Loading...</Dropdown.Item>
            )}

            <Dropdown.Item
              href={troubleshootUrl}
              {...newTabProps}
              className="troubleshoot"
            >
              Not seeing your drive? Click here
            </Dropdown.Item>
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
        <div className="change-mountpoint-help">
          Existing volumes can't be changed. To do so, unistall this package and
          remove its data
        </div>
      )}

      {loadingError && (
        <div className="change-mountpoint-error">
          Error detecting mountpoints: {loadingError}
        </div>
      )}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  mountpoints: getMountpoints,
  isLoading: getIsLoadingStrict.mountpoints,
  loadingError: getLoadingError.mountpoints
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = {
  fetchMountpoints
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectMountpoint);
