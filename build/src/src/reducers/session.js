export default (state = null, action) => {
  switch (action.type) {
    case "CONNECTION_OPEN":
      return action.session;
    case "CONNECTION_CLOSE":
      return action.session;
    default:
      return state;
  }
};
