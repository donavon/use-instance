# @use-it/instance 🐘

A custom React Hook that provides a sensible alternative to `useRef` for storing instance variables.

[![npm version](https://badge.fury.io/js/%40use-it%2Finstance.svg)](https://badge.fury.io/js/%40use-it%2Finstance) [![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)

## Why?

`useRef` is weird. The official React docs say:

>`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

>Note that useRef() is useful for more than the ref attribute. It’s handy for keeping any mutable value around similar to how you’d use instance fields in classes.

The fact that you have to access it via `.current` is strange.
The fact that the React docs call out that you can use it for more than
ref attributes is telling.
They have to know that `useRef` is confusing too.

That's why I created `useInstance`.
You treat the object returned by `useInstance` just like you would `this` in a class component,
so you're already familiar with how it works.

So… Use `useRef` if you're dealing with actual DOM elements—use
`useInstance` for instance properties and methods.

## Installation

```bash
$ npm i @use-it/instance
```

or

```bash
$ yarn add @use-it/instance
```

## Usage

Here is a basic setup. Most people will name the returned object
`self` or `that` or `instance`, but you can call it anything you'd like.

```js
import useInstance from '@use-it/instance';

// Then from within your function component
const instance = useInstance(initialInstance);
```

### Parameters

Here are the parameters that you can use. (\* = optional)

| Parameter   | Description                                                                                                      |
| :---------- | :--------------------------------------------------------------------------------------------------------------- |
| `initialInstance` | Is an object that represents the initial instance value. Defaults to an empty object literal. |

### Return

The return value is an object that WILL NOT change on subsequent calls to your function component.
Use it just like you would to create instance properties and methods in a class component.

## Example

### A replacement for `useRef'

Here's an example where you might use `useRef`.
Within the closure of the `useEffect`, if we simply reference
`count` directly, we will see count as it was during the
creation of the function.
Instead we must make it "live" throughout many render cycles.

```js
function Example() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    latestCount.current = count;
    setTimeout(() => {
      console.log(`You clicked ${latestCount.current} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

And here's the same code using `useInstance`.
It has a more familiar class component-like syntax. 

```js
function Example() {
  const [count, setCount] = useState(0);
  const that = useInstance();

  useEffect(() => {
    that.latestCount = count;
    setTimeout(() => {
      console.log(`You clicked ${that.latestCount} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### A replacement for `useCallback'/useMemo`

You can also use `useInstance` in place of `useCallback` and `useMemo` for some cases.

Take for instance (pardon the pun), this simple up/down counter example.
You might use `useCallback` to ensure that the pointers
to the `increment` and `decrement` function didn't change.

```js
const useCounter = initialCount => {
  const [count, setCount] = useState(initialCount);
  const increment = useCallback(() => setCount(c => c + 1));
  const decrement = useCallback(() => setCount(c => c - 1));

  return {
    count,
    increment,
    decrement,
  };
};
```

Or, you could store them in the instance, much like you
might have done with a class component.

```js
const useCounter = initialCount => {
  const [count, setCount] = useState(initialCount);
  const self = useInstance({
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
  });

  return {
    count,
    ...self,
  };
};
```

What is the benefit of keeping functions in instances variable
instead of using `useCallback`?
This is from the official Hooks documentation.

>In the future, React may choose to “forget” some previously memoized values and recalculate them on next render.

Instance variables don't forget. 🐘

## Live demo

You can view/edit the "you clicked" sample code above on CodeSandbox.

[![Edit demo app on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/6wqqr4y9oz)

## License

**[MIT](LICENSE)** Licensed

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
