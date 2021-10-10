function throttleScrollEvent(fn, removeFn) {
  let lastTime = 0;
  return (count) => {
    if (window.scrollY + document.body.offsetHeight > window.innerHeight) {
      const now = Date.now();
      if (now - lastTime > 1000 && count < 40) {
        console.log(now - lastTime, count);
        fn();
        lastTime = now;
      } else if (count === 40) {
        removeFn();
      } else {
        return;
      }
    }
  };
}

export default throttleScrollEvent;
