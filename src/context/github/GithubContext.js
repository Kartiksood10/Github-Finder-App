import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// App.js compoenent is wrapped aroung <GithubProvider> which is exported from context
export const GithubProvider = ({ children }) => {
  //initial state of reducer is an object with no users
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  // Reducer called into Context
  // dispatch is used to dispatch an action to the reducer
  // state,dispatch is like useState - loading, setLoading
  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Get initial users from API( testing purposes not actually used )

  //   const fetchUsers = async () => {
  //     setLoading();

  //     const response = await fetch(`${GITHUB_URL}/users`, {
  //       headers: {
  //         Authorization: `token ${GITHUB_TOKEN}`,
  //       },
  //     });

  // Search Results from github API
  // STEPS:
  // As we are using an API we create async await function to extract users
  // setLoading is for loading spinner gif
  // create dispatch whose type is caught in reducer switch case
  // call searchUsers function in UserSearch component and apply on search button

  const searchUsers = async (text) => {
    setLoading();

    // custom url in github api where api.github.com/search/users?q=brad returns all brad named users
    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const { items } = await response.json();

    // dispatch is an object whose type is accessed in cases of reducer
    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  // Get a single user

  const getUser = async (login) => {
    setLoading();

    // custom url in github api where api.github.com/search/users/brad returns a single user
    console.log(login);
    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    // if username does not exist go to notfound page
    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json();
      console.log(response, data);

      // dispatch is an object whose type is accessed in cases of reducer
      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  // Get User repos

  const getUserRepos = async (login) => {
    setLoading();

    // To show the latest 10 repos
    const params = new URLSearchParams({
      sort: "created",
      per_page: 10,
    });

    const response = await fetch(
      `${GITHUB_URL}/users/${login}/repos?${params}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    //console.log(data);

    // dispatch is an object whose type is accessed in cases of reducer
    dispatch({
      type: "GET_REPOS",
      payload: data,
    });
  };

  // Clear users when clear is clicked
  // approach to clear Users
  // create a function of dispatch type in context whose type can be fetched by reducer
  // create a new case in reducer with same type and assign users:[] empty
  // go to custom component where button is, call clearUsers from context and apply it onClick={clearUsers}

  const clearUsers = () =>
    dispatch({
      type: "CLEAR_USERS",
    });

  // Set loading
  const setLoading = () =>
    dispatch({
      type: "SET_LOADING",
    });

  return (
    <GithubContext.Provider
      value={{
        // initial state of reducer is defined
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
