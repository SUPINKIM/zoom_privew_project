const Bookmark = ({ parent }) => {
  const render = () => {
    parent.innerHTML = '<div>즐겨찾기</div>';
  };

  render();
};

export default Bookmark;
