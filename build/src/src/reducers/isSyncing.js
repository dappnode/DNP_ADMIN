export default (state = null, action) => {
  switch (action.type) {
    case "UPDATE_IS_SYNCING":
      return action.isSyncing;
    default:
      return state;
  }
};
