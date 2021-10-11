import { ADD_BOOKMARK, REMOVE_BOOKMARK } from './action';

const bookmarkReducer = (state, action) => {
  switch (action.type) {
    case ADD_BOOKMARK:
      return [...state, action.payload];
    case REMOVE_BOOKMARK:
      return state.filter((content) => content !== action.payload);
    default:
      return state;
  }
};

export default bookmarkReducer;
