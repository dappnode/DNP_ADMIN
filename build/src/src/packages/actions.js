// INSTALLER
import * as t from "./actionTypes";
import * as selector from "./selectors";
import * as APIcalls from "API/crossbarCalls";
// modules
import chains from "chains";

// export const add = text => ({
//   type: t.ADD,
//   payload: { text }
// });

export const setId = id => ({
  type: t.SET_ID,
  payload: id
});

export const selectPackage = id => ({
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

// No need to use "addTodo" name, in another module do:
// import todos from 'todos';
// todos.actions.add('Do that thing');
const updatePackage = (data, id) => ({
  type: t.UPDATE_PACKAGE,
  payload: data,
  id: id
});

const updateLog = (data, id) => ({
  type: t.UPDATE_LOG,
  payload: data === "" ? "Received empty logs" : data,
  id: id
});

const updatePackages = packages => ({
  type: t.UPDATE_PACKAGES,
  payload: packages
});

export const listPackages = () => dispatch => {
  APIcalls.listPackages().then(
    packages => (packages ? dispatch(updatePackages(packages)) : null)
  );
};

// With thunk middleware
// dispatch(dispatch(dispatch(action))) = dispatch(action)

const wrapper = ({ APIcall, args, after = "" }) => (dispatch, getState) => {
  const kwargs = args ? args(getState()) : {};
  APIcall(kwargs).then(() => {
    if (after.includes("listPackages")) listPackages()(dispatch);
    if (after.includes("uninstallChain"))
      chains.actions.uninstalledChain(kwargs.id)(dispatch, getState);
  });
};

export const logPackage = ({ options }) => (dispatch, getState) => {
  const kwargs = {
    id: selector.getPackageId(getState()),
    options: options
  };
  APIcalls.logPackage(kwargs).then(res => {
    if (res) dispatch(updateLog(res.logs, res.id));
  });
};

export const updateEnvs = ({ envs, restart }) =>
  wrapper({
    APIcall: APIcalls.updatePackageEnv,
    args: state => ({
      id: selector.getPackageId(state),
      envs: envs,
      restart
    }),
    after: ["listPackages"]
  });

export const togglePackage = () =>
  wrapper({
    APIcall: APIcalls.togglePackage,
    args: state => ({
      id: selector.getPackageId(state)
    }),
    after: ["listPackages"]
  });

export const restartPackage = () =>
  wrapper({
    APIcall: APIcalls.restartPackage,
    args: state => ({
      id: selector.getPackageId(state)
    }),
    after: ["listPackages"]
  });

export const restartVolumes = () =>
  wrapper({
    APIcall: APIcalls.restartVolumes,
    args: state => ({
      id: selector.getPackageId(state)
    }),
    after: ["listPackages"]
  });

export const removePackage = ({ deleteVolumes }) =>
  wrapper({
    APIcall: APIcalls.removePackage,
    args: state => ({
      id: selector.getPackageId(state),
      deleteVolumes
    }),
    after: ["listPackages", "uninstallChain"]
  });
