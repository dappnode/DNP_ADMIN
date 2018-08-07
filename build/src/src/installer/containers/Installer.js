import { connect } from "react-redux";
import * as action from "../actions";
import InstallerView from "../components/InstallerView";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import * as utils from "../utils";

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

// All packages will be stored in the packages object, then requests
// like getDirectory will get a filtered version of that packages

const mapStateToProps = createStructuredSelector({
  directory: selector.getDirectoryNonCores,
  selectedTypes: selector.getSelectedTypes,
  inputValue: selector.getInput,
  fetching: selector.fetching
});

const mapDispatchToProps = dispatch => {
  return {
    fetchDirectory: () => {
      dispatch(action.fetchDirectory());
    },

    openModalFor: id => {
      // Update modal data
      dispatch(action.selectPackage(id));
      // Reset modal data
      dispatch(action.updateSelectedVersion("latest"));
    },

    updateInput: e => {
      // Correct the ipfs format and fecth if correct
      const id = utils.correctPackageName(e.target.value);
      // If the packageLink is a valid IPFS hash preload it's info
      if (utils.isIpfsHash(id)) {
        dispatch(action.fetchPackageVersions(id));
      }
      // Update input field
      dispatch(action.updateInput(id));
    },

    updateSelectedTypes: types => {
      dispatch(action.updateSelectedTypes(types));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerView);
