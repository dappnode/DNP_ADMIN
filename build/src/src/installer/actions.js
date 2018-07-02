// INSTALLER
import * as t from "./actionTypes";
import * as selector from "./selectors";
import * as call from "API/crossbarCalls";

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

export const initialized = () => ({
  type: t.INITIALIZED
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

export const updateAndCheckInput = _id => dispatch => {
  const id = correctPackageName(_id);
  // If the packageLink is a valid IPFS hash preload it's info
  if (id.includes("/ipfs/") && isIpfsHash(id.split("/ipfs/")[1])) {
    dispatch(fetchPackageInfo(id));
  }
  // Update input field
  dispatch(updateInput(id));
};

export const selectPackage = id => (dispatch, getState) => {
  if (!id) id = selector.getInput(getState());
  console.log("Opened modal: ", id);
  dispatch(fetchPackageInfo(id));
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
  call.fetchDirectory().then(directory => {
    dispatch(updateFetching(false));
    // Abort on error
    if (!directory) return;

    // Update directory
    dispatch(updateDirectory(directory));

    // Finish initialization
    dispatch(initialized());

    directory.forEach((pkg, i) => {
      dispatch(updatePackage(pkg, pkg.name));

      // Throttle requests to avoid saturating the IPFS module
      setTimeout(() => {
        call.getPackageData({ id: pkg.name }).then(packageData => {
          dispatch(updatePackage(packageData, pkg.name));
        });
      }, 100 * i);
    });
  });
};

export const fetchPackageInfo = id => dispatch => {
  call.fetchPackageInfo({ id }).then(pkg => {
    if (pkg) dispatch(updatePackage(pkg, pkg.name));
  });
};

export const install = envs => (dispatch, getState) => {
  // Load necessary info
  const selectedPackageName = selector.selectedPackageName(getState());
  const selectedVersion = selector.getSelectedVersion(getState());

  if (Object.getOwnPropertyNames(envs).length > 0) {
    call.updatePackageEnv({
      id: selectedPackageName,
      envs: envs,
      restart: false
    });
  }

  call.addPackage({
    id: selectedPackageName + "@" + selectedVersion
  });
};

const updateAfter = AsyncAction => dispatch => {
  AsyncAction.then(call.listDevices).then(
    devices =>
      devices
        ? dispatch({
            type: t.UPDATE,
            payload: devices
          })
        : null
  );
};

export const add = id => updateAfter(call.addDevice(id));
export const remove = id => updateAfter(call.removeDevice(id));
export const toggleAdmin = id => updateAfter(call.toggleAdmin(id));
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
