//Reducers take two parameters, state and action.
// state is never changed directly, reducer creates new state
// action is an object with type property that chooses conditonal state transitions
// we always keep ...state as we want to update only the written instance of the state and not the entire state

const githubReducer = (state, action) => {
  switch (action.type) {
    // get list of all users
    case "GET_USERS":
      return {
        ...state,
        // data is accessed from context dispatch which is further getting data from api
        users: action.payload,
        loading: false,
      };
    // get a single user
    case "GET_USER":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    // get user repos
    case "GET_REPOS":
      return {
        ...state,
        repos: action.payload,
        loading: false,
      };
    // spinner gif invoked
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };
    // clear users onclick
    case "CLEAR_USERS":
      return {
        ...state,
        users: [],
      };
    default:
      return state;
  }
};

export default githubReducer;
