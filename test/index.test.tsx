import useInstance from '../src';

import { renderHook, cleanup } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

describe('useInstance', () => {
  test('import useInstance from "@use-it/instance"', () => {
    expect(typeof useInstance).toBe('function');
  });

  test('will default to an empty object if passed no parameters`', () => {
    const { result } = renderHook(() => useInstance());
    expect(result.current).toEqual({});
  });

  test('accepts an optional object`', () => {
    const { result } = renderHook(() => useInstance({ foo: 'foo' }));
    expect(result.current).toEqual({ foo: 'foo' });
  });

  test('or an optional "lazy" initialization function that returns an object`', () => {
    const { result } = renderHook(() => useInstance(() => ({ foo: 'foo' })));
    expect(result.current).toEqual({ foo: 'foo' });
  });

  test('the "lazy" initialization function is only called once`', () => {
    const fn = jest.fn(() => false);
    const { result, rerender } = renderHook(() => useInstance(fn));
    expect(result.current).toEqual(false);
    rerender();
    expect(fn).toBeCalledTimes(1);
  });

  test('will return the same instance object for every render`', () => {
    const { result, rerender } = renderHook(() => useInstance());
    const initialObject = result.current;

    rerender();

    expect(result.current).toEqual(initialObject);
  });

  test('will return the same instance object for every render when using a function`', () => {
    const { result, rerender } = renderHook(() => useInstance(() => ({})));
    const initialObject = result.current;

    rerender();

    expect(result.current).toEqual(initialObject);
  });
});
