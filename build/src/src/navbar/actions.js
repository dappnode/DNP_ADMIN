// NAVBAR
import * as t from "./actionTypes";
import * as APIcall from "API/crossbarCalls";

// export const add = text => ({
//   type: t.ADD,
//   payload: { text }
// });

// No need to use "addTodo" name, in another module do:
// import todos from 'todos';
// todos.actions.add('Do that thing');
export const updateVpnParams = params => ({
  type: t.PARAMS,
  payload: params
});

export const fetchVpnParams = () => dispatch => {
  APIcall.getVpnParams().then(
    params => (params ? dispatch(updateVpnParams(params)) : null)
  );
};

// const wait = () => new Promise(resolve => setTimeout(resolve, 1000));
