# @use-it/instance 🐘

A custom React Hook that provides a sensible alternative to `useRef` for storing instance variables.

[![npm version](https://badge.fury.io/js/%40use-it%2Finstance.svg)](https://badge.fury.io/js/%40use-it%2Finstance)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

## Why?

`useRef` is weird. The official React docs say:

> `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

> Note that useRef() is useful for more than the ref attribute. It’s handy for keeping any mutable value around similar to how you’d use instance fields in classes.

The fact that you have to access it via `.current` is strange.
The fact that the React docs call out that you can use it for more than
ref attributes is telling.
They have to know that `useRef` is confusing too.

That's why I created `useInstance`.
You treat the object returned by `useInstance` just like you would `this` in a class component,
so you're already familiar with how it works.

So… Use `useRef` if you're dealing with actual DOM elements—use
`useInstance` for instance properties and methods.

Some may say _"Six of one, hald dozen of another,"_ and they could be right.
But if you're in the "half-dozen" camp, `useInstance` might well be for you!

Want more evidence that `useRef` is weird?
In the latest [React v17 RC](https://reactjs.org/blog/2020/08/10/react-v17-rc.html#potential-issues) under "Potential Issues" it shows that this code could break.

```js
useEffect(() => {
  someRef.current.someSetupMethod();
  return () => {
    someRef.current.someCleanupMethod();
  };
});
```

The solution that they are suggesting (below) is to use an instance variable, which is exactly what `useInstance` is doing. Had React implimented `useInstance` this "potential issue" would never have be be raised.

```js
useEffect(() => {
  const instance = someRef.current;
  instance.someSetupMethod();
  return () => {
    instance.someCleanupMethod();
  };
});
```

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

| Parameter         | Description                                                                                                                        |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `initialInstance` | Is an object or a function that returns an object that represents the initial instance value. Defaults to an empty object literal. |

### Return

The return value is an object that WILL NOT change on subsequent calls to your function component.
Use it just like you would to create instance properties and methods in a class component.

## Examples

### A replacement for `useRef`

Here's an example where you might use `useRef`.
Within the closure of the `useEffect`, if we simply reference
`callback` directly, we will see `callback` as it was during the
creation of the function.
Instead we must make it "live" throughout many render cycles.

```js
function useInterval(callback, delay) {
  const savedCallback = useRef();
  savedCallback.current = callback;

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
```

And here's the same code using `useInstance`.
It has a more familiar class component-like syntax.
Again, think of `instance` as `this`.

```js
function useInterval(callback, delay) {
  const instance = useInstance();
  instance.savedCallback = callback;

  useEffect(() => {
    function tick() {
      instance.savedCallback();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
```

### A replacement for `useCallback`/`useMemo`

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

> In the future, React may choose to “forget” some previously memoized values and recalculate them on next render.

Instance variables never forget. 🐘

### Lazy initialization

If computing the `initialInstance` is costly, you may pass a function that returns an `initialInstance`.
`useInstance` will only call the function on mount.

Not that creating two functions is expensive,
but we could re-write the example above using a lazy initializer, like this.

```js
// this is only called once, on mount, per component instance
const getInitialInstance = setCount => ({
  increment: () => setCount(c => c + 1),
  decrement: () => setCount(c => c - 1),
});

const useCounter = initialCount => {
  const [count, setCount] = useState(initialCount);
  const self = useInstance(getInitialInstance(setCount));

  return {
    count,
    ...self,
  };
};
```

Notice that we moved `getInitialInstance` into a static fucntion _outside_ of `useCounter`.
This helps to reduce the complexity of `useCounter`.
An added side effect is that `getInitialInstance` is now highly testable.

You might even take this one step further and refactor your methods
into it's own custom Hook. Isn't coding fun? 😊

```js
const getInitialInstance = setCount => ({
  increment: () => setCount(c => c + 1),
  decrement: () => setCount(c => c - 1),
});

const useCounterMethods = setCount => useInstance(getInitialInstance(setCount));

const useCounter = initialCount => {
  const [count, setCount] = useState(initialCount);
  const methods = useCounterMethods(setCount);

  return {
    count,
    ...methods,
  };
};
```

## Live demo

You can view/edit the "you clicked" sample code above on CodeSandbox.

[![Edit demo app on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/6wqqr4y9oz)

## License

**[MIT](LICENSE)** Licensed

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://donavon.com"><img src="https://avatars3.githubusercontent.com/u/887639?v=4" width="100px;" alt=""/><br /><sub><b>Donavon West</b></sub></a><br /><a href="#ideas-donavon" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-donavon" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-donavon" title="Maintenance">🚧</a> <a href="https://github.com/donavon/use-instance/pulls?q=is%3Apr+reviewed-by%3Adonavon" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/donavon/use-instance/commits?author=donavon" title="Code">💻</a> <a href="#design-donavon" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/derek-rmd"><img src="https://avatars0.githubusercontent.com/u/46328094?v=4" width="100px;" alt=""/><br /><sub><b>Derek Jones</b></sub></a><br /><a href="https://github.com/donavon/use-instance/commits?author=derek-rmd" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
