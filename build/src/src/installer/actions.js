// INSTALLER
import * as t from "./actionTypes";
import * as selector from "./selectors";
// modules

// export const add = text => ({
//   type: t.ADD,
//   payload: { text }
// });
export const updateFetching = fetching => ({
  type: t.UPDATE_FETCHING,
  fetching
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

export const selectPackage = id => (dispatch, getState) => {
  if (!id) id = selector.getInput(getState());
  dispatch(fetchPackageVersions(id));
  dispatch(updateSelectedPackage(id));
};

// No need to use "addTodo" name, in another module do:
// import todos from 'todos';
// todos.actions.add('Do that thing');
export const updatePackage = (data, id) => ({
  type: t.UPDATE_PACKAGE,
  data,
  id
});

export const fetchDirectory = () => ({
  type: t.FETCH_DIRECTORY
});

export const fetchPackageVersions = id => ({
  type: t.FETCH_PACKAGE_VERSIONS,
  id
});

export const install = () => ({
  type: t.INSTALL
});

// Need to notify the chain that a package has been added

export const updateEnv = env => ({
  type: t.UPDATE_ENV,
  env
});
