import { useEffect, useRef, useReducer } from 'react';

type StoreInitializer<T> = (manipulation: { get(): T; set(diff: Partial<T>): void }) => T;

type EqualsFn = (a: any, b: any) => boolean;

interface Listener<T> {
  handler: Function;
  selector: (state: T) => any;
  equals?: EqualsFn;
  current: any;
}

export let createStore = <T = any>(initializer: StoreInitializer<T>) => {
  let state: T;
  let listeners = new Set<Listener<T>>();

  let getState = (): T => state;
  let setState = (diff: Partial<T>) => {
    state = Object.assign({}, state, diff);

    listeners.forEach(listener => {
      let equals = listener.equals || Object.is;
      let newSlice = listener.selector(state);

      if (!equals(listener.current, newSlice)) {
        listener.current = newSlice;
        listener.handler();
      }
    });
  };

  state = initializer({
    get: getState,
    set: setState
  }) as T;

  let useStore = (selector: (state: T) => any, equals?: EqualsFn) => {
    let rerender = useReducer(c => c + 1, 0)[1];
    let listenerRef = useRef<Listener<T>>();
    let slice = selector(state);

    if (!listenerRef.current) {
      listenerRef.current = {
        handler: rerender,
        equals,
        selector,
        current: slice
      };

      listeners.add(listenerRef.current);
    }

    useEffect(() => {
      if (!listenerRef.current) return;

      listenerRef.current.selector = selector;
      listenerRef.current.equals = equals;
    }, [selector, equals]);

    useEffect(
      () => () => {
        if (!listenerRef.current) return;
        listeners.delete(listenerRef.current);
      },
      []
    );

    return listenerRef.current.current;
  };

  return {
    useStore,
    store: {
      getState,
      setState
    }
  };
};
