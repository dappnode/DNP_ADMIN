import { connect } from "react-redux";
import * as action from "../actions";
import InstallerView from "../components/InstallerView";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";

// Utils

function isIpfsHash(hash) {
  return hash.startsWith("Qm") && !hash.includes(".") && hash.length === 46;
}

function correctPackageName(req) {
  // First determine if it contains an ipfs hash
  if (req.startsWith("ipfs/") && isIpfsHash(req.split("ipfs/")[1]))
    return "/" + req;
  else if (isIpfsHash(req)) return "/ipfs/" + req;
  else return req;
}

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
  directory: selector.getDirectory,
  selectedTypes: selector.getSelectedTypes,
  inputValue: selector.getInput,
  isInitialazing: selector.isInitialazing
});

const mapDispatchToProps = dispatch => {
  return {
    fetchDirectory: () => {
      dispatch(action.fetchDirectory());
    },

    openModalFor: id => {
      // Fetch package info
      dispatch(action.fetchPackageInfo(id));
      // Update modal data
      dispatch(action.selectPackage(id));
      // Reset modal data
      dispatch(action.updateSelectedVersion("latest"));
    },

    updateInput: e => {
      // Correct the packageLink in case it is an IPFS hash
      const id = correctPackageName(e.target.value);
      // If the packageLink is a valid IPFS hash preload it's info
      if (id.includes("/ipfs/") && isIpfsHash(id.split("/ipfs/")[1])) {
        dispatch(action.fetchPackageInfo(id));
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
