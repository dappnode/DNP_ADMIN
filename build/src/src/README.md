## Folder structure

Inspired by https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1

```
/src
  /components
    /Button
    /Notifications
      /components
        /ButtonDismiss
          /images
          /locales
          /specs
          /index.js
          /styles.scss
      /index.js
      /styles.scss

  /pages
    /Home
      /components
        /ButtonLike
      /services
        /processData
      /index.js
      /styles.scss
    /Sign
      /components
        /FormField
      /pages
        /Login
        /Register
          /locales
          /specs
          /index.js
          /styles.scss

  /services
    /api
    /geolocation
    /session
      /actions.js
      /index.js
      /reducer.js
    /users
      /actions.js
      /api.js
      /reducer.js

  index.js
  store.js
```

## Decouple reducers and selectors

Use named scopes with a `mountPoint` variable, inspired by https://medium.com/@DjamelH/ducks-redux-reducer-bundles-44267f080d22

```
/services
  /someService
    /actions.js
    /actionTypes.js
    /data.js
    /index.js
    /reducer.js
    /sagas.js
    /selectors.js
```

```js
// data.js
export const mountPoint = "someService";
```

```js
// selectors.js
import { mountPoint } from "./data";
export const getDappnodeIdentity = createSelector(
  state => state[mountPoint],
  dappnodeIdentity => dappnodeIdentity
);
```

```js
// rootReducer
import services from "./services";
const servicesReducers = {};
Object.values(services).forEach(({ mountPoint, reducer }) => {
  servicesReducers[mountPoint] = reducer;
});
export default combineReducers(servicesReducers);
```

## Test selectors

Tests the data flow of store -> saga, store -> UI.
It's a plain function, receives a state and returns info.

```jsx
describe("Some selector", () => {
    it("Should return the name", () => {
        const state = { name: "Mike" };
        expect(s.getName(state)).toEqual("Mike");
    };
};
```

Check `build/src/src/__tests__/installer/selector.test.js` for reference

## Test sagas + reducers

Test the data flow of action -> store, subscription -> store
Use a library like [redux-saga-test-plan](http://redux-saga-test-plan.jeremyfairbank.com/) to setup mocks and test:

- given: a saga, selectors, reducers, initial store
- execute: an action
- assert: a final store state, displatched actions

```jsx
import { call, select, take } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";

const INCREASE_AGE = "INCREASE_AGE";

const initialState = { age: 17 };

function reducer(state = initialState, action) {
  if (action.type === UPDATE_AGE) {
    return {
      ...state,
      age: action.age
    };
  }
  return state;
}

const getAge = state => state.age;
const apiMock = async x => x + 1;

function* saga(api) {
  yield take(INCREASE_AGE);
  const age = yield select(getAge);
  const newAge = yield call(apiMock, age);
  yield put({ type: UPDATE_AGE, age: newAge });
  return newAge;
}

it("handles reducers", async () => {
  const api = { updateDog() {} };
  const { storeState, returnValue } = await expectSaga(saga, api)
    .withReducer(reducer, initialState) // The initial state is defined in the reducer
    .call(apiMock, 17) // This asserts that apiMock was called with arg 17
    // This dispatch triggers the test
    .dispatch({ type: INCREASE_AGE })
    .run();
  // With async syntax assert the final store state latter
  expect(storeState.age).toEqual(18);
  expect(returnValue).toEqual(18);
});
```
