import { connect } from "react-redux";
import * as action from "../actions";
import DevicesInterfaceView from "../components/DevicesInterface";
import { createStructuredSelector } from "reselect";
import { getAll } from "../selectors";

// const getVisibleTodos = (todos, filter) => {
//   switch (filter) {
//     case 'SHOW_ALL':
//       return todos
//     case 'SHOW_COMPLETED':
//       return todos.filter(t => t.completed)
//     case 'SHOW_ACTIVE':
//       return todos.filter(t => !t.completed)
//   }
// }

const mapStateToProps = createStructuredSelector({
  deviceList: getAll
});

const mapDispatchToProps = dispatch => {
  return {
    fetchDevices: () => {
      dispatch(action.list());
    },
    addDevice: id => {
      // Ensure id contains only alphanumeric characters
      const correctedId = id.replace(/\W/g, "");
      dispatch(action.add(correctedId));
    },
    removeDevice: id => {
      dispatch(action.remove(id));
    },
    toggleAdmin: id => {
      dispatch(action.toggleAdmin(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicesInterfaceView);
