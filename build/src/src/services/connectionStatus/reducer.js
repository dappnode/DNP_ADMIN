// Service > connectionStatus

const initialState = {
  isOpenning: true,
  isOpen: false,
  error: null,
  session: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "CONNECTION_OPEN":
      return {
        ...state,
        isOpenning: false,
        isOpen: true,
        session: action.session,
        error: null
      };

    case "CONNECTION_CLOSE":
      return {
        ...state,
        isOpenning: false,
        isOpen: false,
        session: action.session,
        error: [action.reason, (action.details || {}).message]
          .filter(x => x)
          .join(" - ")
      };

    default:
      return state;
  }
}
