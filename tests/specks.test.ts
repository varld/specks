import { createStore } from '../src'

describe('basic api', () => {
  test('initial state can be accessed', () => {
    let { store } = createStore(() => ({
      hello: 'world'
    }));

    expect(store.getState()).toMatchObject({
      hello: 'world'
    });
  });

  test('state can be set', () => {
    let { store } = createStore(() => ({
      hello: 'world'
    }));

    expect(store.getState().hello).toEqual('world');

    store.setState({
      hello: 'mars'
    });

    expect(store.getState().hello).toEqual('mars');
  });

  test('state can be set using actions', () => {
    let { store } = createStore(({ get, set }) => ({
      hello: 'world',
      action: (param: string) => {
        set({ hello: `${ get().hello } and ${ param }` });
      }
    }));

    expect(store.getState().hello).toEqual('world');
    store.getState().action('mars')
    expect(store.getState().hello).toEqual('world and mars');
  });

  test('state can be set using async actions', async () => {
    let { store } = createStore(({ get, set }) => ({
      hello: 'world',
      action: (param: string) => new Promise((resolve, reject) => {
        setTimeout(() => {
          set({ hello: `${ get().hello } and ${ param }` });
          resolve();
        }, 100);
      })
    }));

    expect(store.getState().hello).toEqual('world');
    await store.getState().action('mars')
    expect(store.getState().hello).toEqual('world and mars');
  });
})