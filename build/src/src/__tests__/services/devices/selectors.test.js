import * as s from "../../../services/devices/selectors";
import { mountPoint } from "../../../services/devices/data";
import { mountPoint as dappnodeStatusMountPoint } from "../../../services/dappnodeStatus/data";

describe("service/devices", () => {
  describe("getDevices", () => {
    const filename = "7e00cfadbe61f2ed";
    const key = "mc5pGQQ4VbbuWJDayJD0kXsElAUddmUktJYUYSDNaDE=";
    const internalIp = "192.168.0.1";
    const device = {
      id: "MyPhone",
      admin: false,
      filename,
      key
    };

    it("Should return a devices array with extra info", () => {
      const state = {
        [mountPoint]: {
          [device.id]: {
            id: "MyPhone",
            admin: false,
            filename,
            key
          }
        },
        [dappnodeStatusMountPoint]: {
          params: {
            name: "MyDAppNode",
            ip: "85.84.83.82",
            noNatLoopback: true,
            internalIp
          }
        }
      };

      const devices = s.getDevices(state);
      expect(devices.length).toEqual(1);
      expect(devices[0]).toEqual({
        ...device,
        url:
          "http://85.84.83.82:8090/?name=MyDAppNode&intip=192.168.0.1&ip=85.84.83.82&id=7e00cfadbe61f2ed#mc5pGQQ4VbbuWJDayJD0kXsElAUddmUktJYUYSDNaDE%3D"
      });
    });
  });
});
