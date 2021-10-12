import { actions } from '../redux/action';

function checkBookmarkDiff(store, lists) {
  if (lists?.length) {
    const {
      state: { likeIds },
    } = store.getState();

    for (let list of lists) {
      const idx = list.querySelector('div').id.replace('category-item-', '');
      const { innerText: text } = list.querySelector('.bookmark-button');
      if (text === '☆' && likeIds.includes(idx)) {
        list.querySelector('.bookmark-button').innerText = '★';
      } else if (text === '★' && !likeIds.includes(idx)) {
        list.querySelector('.bookmark-button').innerText = '☆';
      }
    }
  }
}

function checkClickBookmarkButton(className) {
  return className === 'bookmark-button' ? true : false;
}

function onHandleClickBookmark(store, id, text) {
  const idx = id.replace('bookmark-button-', '');
  if (text === '☆') {
    store.dispatch(actions.addBookmark(idx));
  } else {
    store.dispatch(actions.removeBookmark(idx));
  }
}

function onHandleClickListItem(event, store) {
  const { id, className, innerText } = event.target;
  if (checkClickBookmarkButton(className)) {
    onHandleClickBookmark(store, id, innerText);
    return;
  }

  for (let element of event.path) {
    if (element.id?.includes('category-item')) {
      console.log(element.id);
    }
  }
}

export {
  checkBookmarkDiff,
  checkClickBookmarkButton,
  onHandleClickBookmark,
  onHandleClickListItem,
};
