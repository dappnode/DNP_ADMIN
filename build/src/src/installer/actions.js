// INSTALLER
import * as t from "./actionTypes";
import * as selector from "./selectors";
import * as APIcall from "API/crossbarCalls";
// modules
import packages from "packages";
import chains from "chains";

// export const add = text => ({
//   type: t.ADD,
//   payload: { text }
// });
export const updateFetching = fetching => ({
  type: t.UPDATE_FETCHING,
  payload: fetching
});

export const updateSelectedPackage = id => ({
  type: t.UPDATE_SELECTED_PACKAGE,
  payload: id
});

export const updateInput = id => ({
  type: t.UPDATE_INPUT,
  payload: id
});

export const updateSelectedVersion = index => ({
  type: t.UPDATE_SELECTED_VERSION,
  payload: index
});

export const updateSelectedTypes = types => ({
  type: t.UPDATE_SELECTED_TYPES,
  payload: types
});

export const packageStartedInstalling = id => ({
  type: t.ISINSTALLING,
  payload: true,
  id
});

export const packageFinishedInstalling = id => ({
  type: t.ISINSTALLING,
  payload: false,
  id
});

export const updateAndCheckInput = _id => dispatch => {
  const id = correctPackageName(_id);
  // If the packageLink is a valid IPFS hash preload it's info
  if (id.includes("/ipfs/") && isIpfsHash(id.split("/ipfs/")[1])) {
    dispatch(fetchPackageVersions(id));
  }
  // Update input field
  dispatch(updateInput(id));
};

export const selectPackage = id => (dispatch, getState) => {
  if (!id) id = selector.getInput(getState());
  dispatch(fetchPackageVersions(id));
  dispatch(updateSelectedPackage(id));
};

// No need to use "addTodo" name, in another module do:
// import todos from 'todos';
// todos.actions.add('Do that thing');
const updatePackage = (data, id) => ({
  type: t.UPDATE_PACKAGE,
  payload: data,
  id: id
});

const updateDirectory = directory => ({
  type: t.UPDATE_DIRECTORY,
  payload: directory
});

export const fetchDirectory = () => dispatch => {
  dispatch(updateFetching(true));
  APIcall.fetchDirectory().then(directory => {
    // fetchDirectory CALL DOCUMENTATION:
    // > kwargs: {}
    // > result: [{
    //     name,
    //     status
    //   },
    //   ...]
    dispatch(updateFetching(false));
    // Abort on error
    if (!directory) return;

    // Update directory
    dispatch(updateDirectory(directory));

    directory.forEach((pkg, i) => {
      // Send basic package info immediately for progressive loading appearance
      dispatch(updatePackage(pkg, pkg.name));
      APIcall.getPackageData({ id: pkg.name }).then(packageData => {
        // getPackageData CALL DOCUMENTATION:
        // > kwargs: { id }
        // > result: {
        //     manifest,
        //     avatar
        //   }
        dispatch(updatePackage(packageData, pkg.name));
      });
    });
  });
};

export const fetchPackageVersions = id => dispatch => {
  APIcall.fetchPackageVersions({ id }).then(pkg => {
    if (pkg) dispatch(updatePackage(pkg, pkg.name));
  });
};

export const install = envs => (dispatch, getState) => {
  // Load necessary info
  const selectedPackageName = selector.selectedPackageName(getState());
  const selectedVersion = selector.getSelectedVersion(getState());
  const isInstalling = selector.isInstalling(getState());

  // Prevent double installations, 1. check if the package is in the blacklist

  if (isInstalling[selectedPackageName]) {
    return console.error(selectedPackageName + " IS ALREADY INSTALLING");
  }

  // blacklist the current package
  dispatch(packageStartedInstalling(selectedPackageName));

  if (Object.getOwnPropertyNames(envs).length > 0) {
    APIcall.updatePackageEnv({
      id: selectedPackageName,
      envs: envs,
      restart: false
    });
  }

  APIcall.addPackage({
    id: selectedPackageName + "@" + selectedVersion
  }).then(() => {
    // Remove package from blacklist
    dispatch(packageFinishedInstalling(selectedPackageName));
    // Fetch directory
    dispatch(fetchDirectory());
    // Fetch package list
    dispatch(packages.actions.listPackages());
    // Trigger installChain
    chains.actions.installedChain(selectedPackageName)(dispatch, getState);
  });
};

const updateAfter = AsyncAction => dispatch => {
  AsyncAction.then(APIcall.listDevices).then(
    devices =>
      devices
        ? dispatch({
            type: t.UPDATE,
            payload: devices
          })
        : null
  );
};

export const add = id => updateAfter(APIcall.addDevice(id));
export const remove = id => updateAfter(APIcall.removeDevice(id));
export const toggleAdmin = id => updateAfter(APIcall.toggleAdmin(id));
export const list = () => updateAfter(nothing());

const nothing = async () => {};

// const wait = () => new Promise(resolve => setTimeout(resolve, 1000));

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
