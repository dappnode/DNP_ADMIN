import { connect } from "react-redux";
import * as action from "../actions";
import InstallerModalView from "../components/InstallerModalView";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";

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

// // Check if allow install or not
// let disableInstall;
// if (
//   this.props.packageData &&
//   this.props.packageData.manifest &&
//   getTag(
//     this.props.packageData.currentVersion,
//     this.props.packageData.manifest.version
//   ).toLowerCase() === "installed"
// )
//   disableInstall = true;
const latestTag = "latest";

// All packages will be stored in the packages object, then requests
// like getDirectory will get a filtered version of that packages

const mapStateToProps = createStructuredSelector({
  pkg: selector.selectedPackage,

  directory: selector.getDirectory,

  manifest: selector.manifestModal,

  packageName: selector.selectedPackageName,

  versions: state => {
    const latestVersion = selector.selectedPackageManifest(state);
    // Deep clone the version names, returns [] if none
    const versions = [...selector.selectedPackageVersionsNames(state)];
    // If there is a manifest prepend a "latest" version tag
    if (latestVersion) versions.unshift(latestTag);
    return versions;
  },

  selectedVersion: selector.getSelectedVersion,

  installTag: selector.selectedPackageInstallTag,

  disableInstall: state => {
    const installTag = selector.selectedPackageInstallTag(state);
    return installTag === "installed" || installTag === "update";
  }
});

const mapDispatchToProps = dispatch => {
  return {
    updateSelectedVersion: e => {
      dispatch(action.updateSelectedVersion(e.target.value));
    },

    install: env => {
      dispatch(action.install());
      dispatch(action.updateEnv(env));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerModalView);
