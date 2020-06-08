import React, { useEffect } from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createStore } from '../src';

describe('react api', () => {
  test('can access store', async () => {
    let { useStore } = createStore(({ set, get }) => ({
      count: 1,
      add: (num: number = 1) => {
        set({ count: get().count + num });
      }
    }));

    let Component = () => {
      let state = useStore(s => s);

      useEffect(() => state.add(), []);

      return <p>count is {state.count}</p>;
    };

    render(<Component />);
    await waitFor(() => screen.getByText('count is 2'));
  });

  test('can access store using slices', async () => {
    let { useStore } = createStore(({ set, get }) => ({
      count: 1,
      add: (num: number = 1) => {
        set({ count: get().count + num });
      }
    }));

    let Component = () => {
      let count = useStore(s => s.count);
      let add = useStore(s => s.add);

      useEffect(() => add(), []);

      return <p>count is {count}</p>;
    };

    render(<Component />);
    await waitFor(() => screen.getByText('count is 2'));
  });

  test('can call actions on event', async () => {
    let { useStore } = createStore(({ set, get }) => ({
      count: 1,
      add: (num: number = 1) => {
        set({ count: get().count + num });
      }
    }));

    let Component = () => {
      let count = useStore(s => s.count);
      let add = useStore(s => s.add);

      return (
        <div>
          <p role="count">count is {count}</p>
          <button onClick={() => add(10)}>add 10</button>
        </div>
      );
    };

    render(<Component />);
    await waitFor(() => screen.getByText('count is 1'));
    fireEvent.click(screen.getByText('add 10'));
    expect(screen.getByRole('count')).toHaveTextContent('count is 11');
  });
});
