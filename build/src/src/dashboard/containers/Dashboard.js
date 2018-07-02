import { connect } from "react-redux";
import * as action from "../actions";
import DashboardView from "../components/DashboardView";
import { createStructuredSelector } from "reselect";
// modules
import status from "status";
import chains from "chains";

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
  status: status.selectors.getAll,
  chains: chains.selectors.getAll
});

const mapDispatchToProps = dispatch => {
  return {
    check: () => {
      // dispatch(action.check());
    },
    init: () => {
      dispatch(action.init());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardView);
