export default (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_PACKAGE_STATUS":
      return {
        ...state,
        [action.packageName]: action.connected
      };
    default:
      return state;
  }
};
