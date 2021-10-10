const SubPage = ({ parent, url, category }) => {
  let state = {};

  const componentDidMount = () => {
    //fetch ranking data
  };

  const render = () => {
    parent.innerHTML = `<div>Temp Sub ${category}</div>`;
  };

  const setState = (newState) => {
    state = { ...state, ...newState };
    render();
  };

  render();
};

export default SubPage;
