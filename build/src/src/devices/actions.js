// DEVICES
import * as t from "./actionTypes";
import * as APIcall from "API/crossbarCalls";

// export const add = text => ({
//   type: t.ADD,
//   payload: { text }
// });

// No need to use "addTodo" name, in another module do:
// import todos from 'todos';
// todos.actions.add('Do that thing');

const updateAfter = AsyncAction => dispatch => {
  AsyncAction.then(APIcall.listDevices).then(
    devices =>
      devices
        ? dispatch({
            type: t.UPDATE,
            payload: devices
          })
        : null
  );
};

export const add = id => updateAfter(APIcall.addDevice({ id }));
export const remove = id => updateAfter(APIcall.removeDevice({ id }));
export const toggleAdmin = id => updateAfter(APIcall.toggleAdmin({ id }));
export const list = () => updateAfter(nothing());

const nothing = async () => {};

// const wait = () => new Promise(resolve => setTimeout(resolve, 1000));
