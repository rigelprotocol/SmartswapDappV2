/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { enableMapSet } from 'immer';
import createReducer from './reducers';
enableMapSet();
export const SetTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState, key) =>
    // convert mySet to an Array.
    ({
      ...inboundState,
      tokenList: [...inboundState.tokenList],
      userTokenList: [...inboundState.userTokenList],
    }),
  // transform state being rehydrated
  (outboundState, key) =>
    // convert tokenList back to a Set.
    ({
      ...outboundState,
      tokenList: new Set(outboundState.tokenList),
      userTokenList: new Set(outboundState.userTokenList),
    }),
  // define which reducers this transform gets called for.
  { whitelist: ['ExtendedTokenList'] },
);

export default function configureStore(initialState = {}, history) {
  const persistConfig = {
    // configuration object for redux-persist
    key: 'root',
    storage, // define which storage to use
    // transforms: [SetTransform],
    whitelist: ['ExtendedTokenList'],
    // blacklist : []
  };
  const persistedReducer = persistReducer(persistConfig, createReducer());
  let composeEnhancers = compose;

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
    /* eslint-enable */
  }

  const middlewares = [thunk, routerMiddleware(history)];

  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(...enhancers),
  );
  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer());
    });
  }

  const persistor = persistStore(store);
  return { store, persistor };
}
