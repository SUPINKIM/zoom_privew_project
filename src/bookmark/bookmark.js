import Card from '../component/card/card';

const Bookmark = ({ parent }) => {
  let state = {
    likeContents: [],
  };

  const render = () => {
    parent.innerHTML = `<div>
      <div>#즐겨찾기</div>
      <ul>
        ${
          state.likeContents.length > 0
            ? state.likeContents
                .map((content) => `<li>${Card(content)}</li>`)
                .join('')
            : '<div>등록된 즐겨찾기가 없습니다. </div>'
        }
      </ul>
    </div>`;
  };

  const componentDidMount = () => {};

  render();
};

export default Bookmark;
