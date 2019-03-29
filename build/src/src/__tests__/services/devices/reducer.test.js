import reducer from "../../../services/devices/reducer";
import * as a from "../../../services/devices/actions";

describe("services > devices > reducer", () => {
  const device1 = "Alice";
  const device2 = "Bob";
  const url = "otp-link";
  let state = {};

  it("Should add devices, as an object", () => {
    const action = a.updateDevices({ [device1]: { id: device1 } });
    state = reducer(state, action);
    expect(state).toEqual({
      [device1]: { id: device1 }
    });
  });

  it("Should be able to update a device", () => {
    const action = a.updateDevice(device1, { url });
    state = reducer(state, action);
    expect(state).toEqual({
      [device1]: { id: device1, url }
    });
  });

  it("Should not allow to update a non-existing device", () => {
    const action = a.updateDevice(device2, { id: device2 });
    state = reducer(state, action);
    expect(state).toEqual({
      [device1]: { id: device1, url }
    });
  });
});
