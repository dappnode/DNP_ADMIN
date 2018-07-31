import { connect } from "react-redux";
import * as action from "../actions";
import InstallerModalView from "../components/InstallerModalView";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";

// All packages will be stored in the packages object, then requests
// like getDirectory will get a filtered version of that packages

const mapStateToProps = createStructuredSelector({
  pkg: selector.selectedPackage,

  manifest: selector.manifestModal,

  packageName: selector.selectedPackageName,

  installTag: selector.selectedPackageInstallTag,

  disableInstall: state => {
    const installTag = selector.selectedPackageInstallTag(state);
    return installTag === "installed" || installTag === "update";
  }
});

const mapDispatchToProps = dispatch => {
  return {
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
