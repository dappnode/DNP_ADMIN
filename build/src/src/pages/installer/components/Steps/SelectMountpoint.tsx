import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "components/Button";
import { MdHome, MdRefresh } from "react-icons/md";
import "./selectMountpoint.scss";
import { joinCssClass } from "utils/css";

interface MountpointData {
  mountpoint: string; // mountpoint = "", means host (default)
  use: string;
  total: string;
  free: string;
  vendor: string;
  model: string;
}

const replySample: MountpointData[] = [
  {
    mountpoint: "",
    use: "87%",
    total: "",
    free: "121G",
    vendor: "Host",
    model: "(default)"
  },
  {
    mountpoint: "/data",
    use: "68%",
    total: "500G",
    free: "141G",
    vendor: "ATA",
    model: "CT500MX500SSD4"
  },
  {
    mountpoint: "/media/usb0",
    use: "1%",
    total: "1TB",
    free: "6.2G",
    vendor: "SanDisk",
    model: "Ultra_USB_3.0"
  },
  {
    mountpoint: "/media/usb1",
    use: "100%",
    total: "16GB",
    free: "7.1G",
    vendor: "SanDisk",
    model: "Ultra_USB_3.0"
  }
];

async function fakeMountpointApi(): Promise<MountpointData[]> {
  await new Promise(r => setTimeout(r, 1000));
  return replySample;
}

function SelectMountpoint({
  value,
  onChange,
  options
}: {
  value: string;
  onChange: (value: string) => void;
  options?: {
    alreadySet?: boolean;
    isLegacy?: boolean;
    prevPath?: string;
  };
}) {
  const [mountpoints, setMountpoints] = useState([] as MountpointData[]);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { alreadySet, isLegacy, prevPath } = options || {};
  const selectedDev = mountpoints.find(
    ({ mountpoint }) => mountpoint === value
  );

  // Automatically fetch mountpoints on component load
  useEffect(() => {
    fetchMountpoints();
  }, []);

  // If the user has selected an invalid mountpoint and is not loading or already set,
  // reset the value to the host (default) to prevent problems
  useEffect(() => {
    if (value && !selectedDev && !alreadySet && !loading) onChange("");
  }, [value, selectedDev]);

  async function fetchMountpoints() {
    if (isLegacy) return;
    try {
      setLoading(true);
      const res = await fakeMountpointApi();
      setMountpoints(res);
    } catch (e) {
      console.error(`Error on fetchMountpoints: ${e.stack}`);
    } finally {
      setLoading(false);
    }
  }

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
          >
            <div className="info top">
              {isLegacy ? (
                <>
                  <span>{prevPath}</span>
                  <small>(legacy)</small>
                </>
              ) : selectedDev ? (
                <>
                  {selectedDev.vendor && <span>{selectedDev.vendor}</span>}
                  {selectedDev.total && <span>{selectedDev.total}</span>}
                  {selectedDev.model && <small>{selectedDev.model}</small>}
                </>
              ) : alreadySet ? (
                <>
                  <span>{prevPath}</span>
                  <small>(unknown device)</small>
                </>
              ) : loading ? (
                <span>Loading...</span>
              ) : (
                <span>Select drive</span>
              )}
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {mountpoints.map(
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
                    <span>{vendor}</span>
                    <span>{total}</span>
                    <small>{model}</small>
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
            disabled={loading}
            className={"refresh " + joinCssClass({ loading })}
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

export default SelectMountpoint;
