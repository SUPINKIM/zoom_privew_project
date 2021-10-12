import { actions } from '../redux/action';

function checkBookmarkDiff(store, lists) {
  if (window.location.hash === '#bookmark') return;
  if (lists?.length) {
    const {
      state: { likeContents },
    } = store.getState();

    for (let list of lists) {
      const idx = list.querySelector('div').id.replace('category-item-', '');
      const { innerText: text } = list.querySelector('.bookmark-button');
      const { length } = likeContents.filter((content) => content.idx === +idx);
      if (text === '☆' && length) {
        list.querySelector('.bookmark-button').innerText = '★';
      } else if (text === '★' && !length) {
        list.querySelector('.bookmark-button').innerText = '☆';
      }
    }
  }
}

function checkClickBookmarkButton(className) {
  return className === 'bookmark-button' ? true : false;
}

function onHandleClickBookmark(store, text, info) {
  if (text === '☆') {
    store.dispatch(actions.addBookmark(info));
  } else {
    store.dispatch(actions.removeBookmark(info));
  }
}

function onHandleClickListItem(event, store, lists) {
  const { id, className, innerText } = event.target;

  if (checkClickBookmarkButton(className)) {
    const itemIdx = id.replace('bookmark-button-', '');
    const itemInformation = lists.find((item) => item.idx === +itemIdx);
    onHandleClickBookmark(store, innerText, itemInformation);
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
