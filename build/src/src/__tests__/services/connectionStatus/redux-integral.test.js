import { mountPoint } from "../../../services/connectionStatus/data";
import reducer from "../../../services/connectionStatus/reducer";
import * as a from "../../../services/connectionStatus/actions";
import * as s from "../../../services/connectionStatus/selectors";

describe("services > connectionStatus, integral test of the redux components", () => {
  let state = {};
  const session = {};
  const error = "some error";
  const isNotAdmin = false;

  it("Should set the connection as open", () => {
    state = reducer(state, a.connectionOpen({ session }));
    expect(s.getIsConnectionOpen({ [mountPoint]: state })).toEqual(true);
  });

  it("Should set the connection as closed", () => {
    state = reducer(state, a.connectionClose({ session, error, isNotAdmin }));
    expect(s.getIsConnectionOpen({ [mountPoint]: state })).toEqual(false);
  });
});
