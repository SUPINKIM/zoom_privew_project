import { ADD_BOOKMARK, REMOVE_BOOKMARK } from './action';
import {
  BOOKMARK_STORAGE_KEY,
  getBookmarkFromLocalStorage,
  saveBookmarkInLocalStorage,
} from './storage';
import bookmarkReducer from './reducer';

const initialState = {
  likeIds: [],
};

const Store = (state = initialState) => {
  let globalState = {
    state,
    observed: [],
    reducers: {},
  };

  const setInitialLikeIds = () => {
    const getItems = getBookmarkFromLocalStorage();
    if (getItems) {
      globalState.state.likeIds = getItems;
    }
  };

  const nofifyObserved = () => {
    const { observed } = globalState;
    for (let callback of observed) {
      callback();
    }
  };

  const setState = (newState) => {
    globalState = { ...globalState, ...newState };
  };

  const combineReducers = (newReducerObj) => {
    setState({ reducers: { ...globalState.reducers, ...newReducerObj } });
  };

  const dispatch = ({ type, payload }) => {
    if (type === ADD_BOOKMARK || type === REMOVE_BOOKMARK) {
      const { bookmarkReducer } = globalState.reducers;
      const {
        state: { likeIds },
      } = globalState;
      globalState.state.likeIds = bookmarkReducer(likeIds, {
        type,
        payload: payload,
      });
    }
    saveBookmarkInLocalStorage(globalState.state.likeIds);
    nofifyObserved();
  };

  const subscribeStore = (callback) => {
    const { observed } = globalState;
    observed.push(callback);
    setState({ observed: observed });
  };

  const unSunbscribeStore = (callback) => {
    const { observed } = globalState;
    setState({ observed: observed.filter((fun) => fun !== callback) });
  };

  const getState = () => {
    return globalState;
  };

  setInitialLikeIds();
  combineReducers({ bookmarkReducer: bookmarkReducer });

  return {
    combineReducers,
    dispatch,
    subscribeStore,
    unSunbscribeStore,
    nofifyObserved,
    getState,
  };
};

export default Store;
