import LoadingView from '../component/loading';
import ErrorView from '../component/error';
import Card from '../component/card/card';
import contentApi from '../api';
import throttleScrollEvent from '../utils/throttle';
import './sub.css';

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

  const onHandleScrollEvent = throttleScrollEvent(updateLists, () =>
    componentDidUnmounted()
  );

  const handleScroll = () => onHandleScrollEvent(state.count);

  window.addEventListener('scroll', handleScroll, true);

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
  };

  const componentDidUnmounted = () => {
    window.removeEventListener('scroll', handleScroll, true);
  };

  render();
  componentDidMount();
};

export default SubPage;
