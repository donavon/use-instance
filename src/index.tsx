import { useRef } from 'react';
const UNINITIALIZED = Symbol('useInstance_uninitialized');

type useInstanceArg = (() => any) | any;

const useInstance = <T extends unknown>(
  initialValueOrFunction: useInstanceArg = {}
): T => {
  const ref = useRef<T>(UNINITIALIZED as any);
  if (ref.current === UNINITIALIZED) {
    ref.current =
      typeof initialValueOrFunction === 'function'
        ? initialValueOrFunction()
        : initialValueOrFunction;
  }
  return ref.current;
};

export default useInstance;
