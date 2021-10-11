import LoadingPage from '../component/loading';
import ErrorPage from '../component/error';
import contentApi from '../api';
import './main.css';
import Card from '../component/card/card';
import { actions } from '../redux/action';

const MainPage = ({ parent, store }) => {
  let state = {
    loading: true,
    error: false,
    categoryContent: {},
    topRank: [],
  };

  const setContentBookmark = () => {
    const container = document.querySelector('.category-container');
    const lists = container?.querySelectorAll('.category-item-container');

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
  };

  const onHandleClickTopRank = (event) => {
    console.log(event);
  };

  const onHandleClickBookmark = (id, text) => {
    const idx = id.replace('bookmark-button-', '');
    if (text === '☆') {
      store.dispatch(actions.addBookmark(idx));
    } else {
      store.dispatch(actions.removeBookmark(idx));
    }
  };

  const onHandleClickListItem = (event) => {
    const { id, className, innerText } = event.target;
    if (className === 'bookmark-button') {
      onHandleClickBookmark(id, innerText);
    } else {
      for (let element of event.path) {
        if (element.id?.includes('category-item')) {
          console.log(element.id);
        }
      }
    }
  };

  const addEventListeners = () => {
    const itemElement = document.querySelector('.category-container');
    const toprankElement = document.querySelector('.top12-container');
    itemElement.addEventListener('click', onHandleClickListItem);
    toprankElement.addEventListener('click', onHandleClickTopRank);
  };

  const categoryContentTemplate = (title, lists) => {
    return `<div class="category-content-container">
      <div class="category-content-title">#${title}</div>
      <ul>${lists
        .map((item) => `<li class="category-item-container">${Card(item)}</li>`)
        .join('')}</ul>
    </div>`;
  };

  const topRankTemplate = () => {
    return `
    <div class="top12-title">실시간 TOP 12</div>
    <ul>
        ${state.topRank
          .map((item, index) => {
            return `<li class="top12-list" id="content-${item.idx}">
                <div class="list-rank">${index + 1}</div>
                <div class="list-title">${item.title}</div>
                <div class="list-media">by ${item.mediaName}</div>
            </li>`;
          })
          .join('')}
    </ul>`;
  };

  const render = () => {
    const { loading, error, categoryContent, topRank } = state;
    parent.innerHTML = '';
    if (loading) {
      parent.innerHTML = LoadingPage();
    } else if (error) {
      parent.innerHTML = ErrorPage();
    } else {
      const categoryContainer = document.createElement('div');
      const toprankContainer = document.createElement('div');
      categoryContainer.className = 'category-container';
      toprankContainer.className = 'top12-container';

      if (Object.keys(categoryContent)) {
        const { life, food, travel, culture } = categoryContent;
        [
          ['라이프', life],
          ['푸드', food],
          ['여행', travel],
          ['문화', culture],
        ].forEach(([title, lists]) => {
          if (lists?.length) {
            categoryContainer.innerHTML += categoryContentTemplate(
              title,
              lists
            );
          }
        });
      }

      if (topRank.length) {
        toprankContainer.innerHTML = topRankTemplate();
      }

      parent.appendChild(categoryContainer);
      parent.appendChild(toprankContainer);
      addEventListeners();
      setContentBookmark();
    }
  };

  const setState = (newState) => {
    state = { ...state, ...newState };
    render();
  };

  const componentDidMount = () => {
    const { categoryApi, rankingApi } = contentApi;
    const categories = ['life', 'food', 'travel', 'culture'];
    Promise.all([...categories.map((tag) => categoryApi(tag, 4)), rankingApi()])
      .then((res) => {
        let newStateObj = { categoryContent: {}, topRank: [] };
        res.forEach(({ error, result }, index) => {
          if (error) {
            throw error;
          }
          if (index === res.length - 1) {
            result
              .then(({ data }) => {
                newStateObj.topRank = data;
              })
              .then(() => {
                setState(newStateObj);
              });
          } else {
            result.then(({ data }) => {
              newStateObj['categoryContent'][categories[index]] = data;
            });
          }
        });
      })
      .catch((e) => {
        setState({ error: true });
      })
      .finally(() => {
        setState({ loading: false });
      });
  };

  render();
  componentDidMount();
  store.subscribeStore(setContentBookmark);
};

export default MainPage;
