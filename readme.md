<p align="center">
  <img src="https://i.imgur.com/9bEXX2h.png" width="100%" alt="Specks logo">
</p>

<h3 align="center">
  <b>Simple hook based state management for React.</b> 
</h3>

<p align="center">
  <a href="https://github.com/varld/specks/blob/master/readme.md#getting-started">Getting Started</a>
  <span>&nbsp;&nbsp;&nbsp;</span>
  <a href="https://github.com/varld/specks/blob/master/readme.md#actions-and-the-initializer-function">Actions</a>
  <span>&nbsp;&nbsp;&nbsp;</span>
  <a href="https://codesandbox.io/s/specks-example-61eeh">Codesandbox</a>
</p>

<br />

## Features

- ✨ __Hook based:__ Specks has a simple API based on a React hook.
- 🔥 __`async` actions:__ Actions can be synchronous and async.
- 🙅‍♀️ __Providerless:__ Specks does not need a Context Provider.
- ◽️ __Super minimalist:__ No need to set anything up or learn weird design patterns.
- 🔻 __Tiny:__ Specks only has 82 lines of code.

## Why

Well, you might not always need Redux. Redux is very versatile, but it can get a bit too complicated, especially for small projects. Specks aims to be a tiny state management library for smaller projects. It is built for projects, where Redux is too much but React's built in state management is not enough.

## Getting started

### Installing Specs

You must also install `react` for Specks to work.

```bash
# Using npm
npm install specks

# Using yarn
yarn add specks
```

### Basic Store

```tsx
import { createStore } from 'specks';

let { useStore } = createStore(({ get, set }) => {
  name: 'unknown',
  setName: (name) => {
    set({ name });
  }
});

let Component = () => {
  // Get the needed values from the store
  let name = useStore(s => s.name);
  let setName = useStore(s => s.setName);

  let onNameChange = (e) => {
    // Call the `setName` action
    setName(e.target.name);
  };

  return (
    <div>
      <p>Name: { name }</p>
      <input onChange={ onNameChange } value={ name }>
    </div>
  );
};
```

## Usage

### Actions and the Initializer Function

The initializer function is a function, which contains the initial state and all actions. It gets and object containing two functions (`get` and `set`) as its first parameter. The `get` function accepts no parameters and returns the whole state. The `set` function accepts a partial state object, which will be used to update the state (using `Object.assign`).

Actions are functions which can be used to update the state. In most cases you should use actions instead of updating the state directly. The can have parameters, which you can use to pass additional data, when calling the action.

```tsx
let { /* ... */ } = createStore(({ get, set }) => {
  count: 0,
  addOne: () => {
    let currentCount = get().count;
    set({ count: currentCount + 1 });
  },
  add: (num) => {
    let currentCount = get().count;
    set({ count: currentCount + num });
  }
});
```

### Async Actions

Actions can be async or synchronous, Specks does not care.

```tsx
let { /* ... */ } = createStore(({ get, set }) => {
  // ...
  actionName: async () => {
    let data = await fetchDataFromServer();

    set({ data });
  }
});
```

### Using Slices

If you use the `useStore` hook, the first Argument is a slicing function. It gets passed the whole state and returns any value. Specks will execute this function every time the state changes. If the function's return value changes, the components using it will be rerendered. If the return value does not change, nothing will be rerendered.

The slices return value can be anything. 

```tsx
let Component = () => {
  // Getting a value from the store object
  let value = useStore(s => s.value);

  // Adding a 1 to a value from the store
  let count = useStore(s => s.count + 1);

  // Checking if something is set
  let valueExists = useStore(s => s.value !== undefined);

  // Use a store value in a string
  let greeting = useStore(s => `Hello ${ s.name }`);

  // ...
};
```

### Usage Without React

In some cases you might want to get or set the state outside of a React component. You can use the `store` object which is returned by `createStore` to do that. The `store` object has two functions: `getState` and `setState`. They behave similar the `get` and `set` in the initializer function.

```typescript
let { store } = createStore(({ get, set }) => {
  name: 'unknown',
  setName: (name) => {
    set({ name });
  }
});

let name = store.getState();
store.setState({ name: 'John' });
```

## API

### `createStore(initializer): { store, useStore }`

The `createStore` function is exported from Specks and can be used to create a new store instance.

#### `initializer`

The `initializer` is a function which is used to set up the initial state and all actions. It has one parameter, which is an object containing a `get` and a `set` function used to manipulate the state.

```tsx
let { /* ... */ } = createStore(({ get, set }) => {
  count: 0,
  add: (num) => {
    let currentCount = get().count;
    set({ count: currentCount + num });
  }
});
```

##### `get()`

`get` returns the whole state.

##### `set(partial)`

`set` accepts a partial state object which is used to update state using `Object.assign`. Partial means that it only includes the values which should be changed, all others will remain untouched.

### `store`

`store` can be used to manipulate the state outside of React. It has two values: `getState` and `setState`. 

##### `getState()`

`getState` returns the whole state.

##### `setState(partial)`

`setState` accepts a partial state object which is used to update state using `Object.assign`.

### `useStore(slice)`

`useStore` is a React hook, which can be used to access the state and the actions in a React component.

#### `slice`

`slice` is a function which is used to pick a specific value out of the state (eg. a value or an action). The component will only rerender if the slice's return value changes. The slice function can return any value.

## License

MIT © [Tobias Herber](https://herber.space)
