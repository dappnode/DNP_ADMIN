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
  isHost?: boolean;
  mountpoint: string;
  use: string;
  total: string;
  free: string;
  vendor: string;
  model: string;
}

const defaultMountpoint: MountpointData = {
  isHost: true,
  mountpoint: "",
  use: "",
  total: "",
  free: "",
  vendor: "Host",
  model: "(default)"
};

const replySample: MountpointData[] = [
  {
    isHost: true,
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
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [mountpoints, setMountpoints] = useState([] as MountpointData[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMountpoints();
  }, []);

  async function fetchMountpoints() {
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

  const mountpointsWithHost = mountpoints.find(({ mountpoint }) => !mountpoint)
    ? [defaultMountpoint, ...mountpoints]
    : mountpoints;
  const selectedMountpoint =
    mountpoints.find(({ mountpoint }) => mountpoint === value) ||
    defaultMountpoint;

  return (
    <div className="display-mountpoints">
      <Dropdown drop="down" id="select-mountpoint">
        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
          {selectedMountpoint ? (
            <div className="info top">
              <span className="vendor">{selectedMountpoint.vendor}</span>
              <span className="total">{selectedMountpoint.total}</span>
              <span className="model">{selectedMountpoint.model}</span>
            </div>
          ) : (
            "Select drive"
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {mountpoints.map(
            ({ mountpoint, vendor, model, total, use, free, isHost }) => (
              <Dropdown.Item
                key={mountpoint}
                onClick={() => onChange(mountpoint)}
              >
                <div className="info top">
                  {isHost && (
                    <span className="host">
                      <MdHome />
                    </span>
                  )}
                  <span className="vendor">{vendor}</span>
                  <span className="total">{total}</span>
                  <span className="model">{model}</span>
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

      <Button
        onClick={fetchMountpoints}
        disabled={loading}
        className={"refresh " + joinCssClass({ loading })}
      >
        <MdRefresh />
        <span className="text">Refresh</span>
      </Button>
    </div>
  );
}

export default SelectMountpoint;
