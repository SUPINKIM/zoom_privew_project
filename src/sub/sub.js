import LoadingView from '../component/loading';
import ErrorView from '../component/error';
import Card from '../component/card/card';
import contentApi from '../api';
import './sub.css';

function throttleScrollEvent(fn) {
  let lastTime = 0;
  return (category, count) => {
    const listContainer = document.querySelector('.category-content-lists');
    if (!listContainer) return;
    if (
      window.scrollY + document.body.offsetHeight >
      listContainer.clientHeight
    ) {
      const now = Date.now();
      console.log(category, count);
      if (now - lastTime > 2000 && count < 40) {
        fn();
        lastTime = now;
      } else {
        return;
      }
    }
  };
}

const SubPage = ({ parent, url, category }) => {
  let state = {
    loading: true,
    error: false,
    count: 0,
    data: [],
  };

  const updateLists = async () => {
    const { categoryApi } = contentApi;
    try {
      const { error, result } = await categoryApi(category, 10, state.count);
      if (error) {
        throw error;
      }
      result.then(({ data }) => {
        setState({ data: [...state.data, ...data] });
      });
    } catch (e) {
      setState({ error: true });
    } finally {
      setState({ count: state.count + 10 });
    }
  };

  const checkDiff = () => {};

  const componentDidUnmounted = () => {
    console.log('remove event');
    window.removeEventListener(
      'scroll',
      function () {
        onHandleScrollEvent(category, state.count);
      },
      true
    );
  };

  const render = () => {
    const { loading, error, data } = state;
    if (loading) {
      parent.innerHTML = LoadingView();
    } else if (error) {
      parent.innerHTML = '';
      parent.innerHTML = ErrorView();
    } else {
      parent.innerHTML = `<ul class="category-content-lists">
        ${
          data?.length > 0
            ? data.map((item) => `<li>${Card(item)}</li>`).join('')
            : '<span>데이터가 없습니다.</span>'
        }
      </ul>`;
    }
  };

  const setState = (newState) => {
    state = { ...state, ...newState };
    render();
  };

  const componentDidMount = async () => {
    const { categoryApi } = contentApi;
    try {
      const { error, result } = await categoryApi(category, 10, state.count);
      if (error) {
        throw error;
      }
      result.then(({ data }) => {
        setState({ data });
      });
    } catch (e) {
      setState({ error: true });
    } finally {
      setState({ loading: false, count: state.count + 10 });
    }
    const onHandleScrollEvent = throttleScrollEvent(updateLists);

    window.addEventListener('scroll', function () {
      onHandleScrollEvent(category, state.count);
    });
  };

  render();
  componentDidMount();

  return () => componentDidUnmounted();
};

export default SubPage;
