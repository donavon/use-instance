import { testHook, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

import useInstance from '../src';

afterEach(cleanup);

describe('useInstance', () => {
  test('import useInstance from "@use-it/instance"', () => {
    expect(typeof useInstance).toBe('function');
  });

  test('will default to an empty object if passed no parameters`', () => {
    let self;

    testHook(() => {
      self = useInstance();
    });

    expect(self).toEqual({});
  });

  test('accepts an optional object`', () => {
    let self;

    testHook(() => {
      self = useInstance({ foo: 'foo' });
    });

    expect(self).toEqual({ foo: 'foo' });
  });

  test('will return the same instance object for every render`', () => {
    let self;

    const { rerender } = testHook(() => {
      self = useInstance();
    });

    const symbol = Symbol('');
    self.symbol = symbol;

    rerender();

    expect(self).toEqual({ symbol });
  });
});
