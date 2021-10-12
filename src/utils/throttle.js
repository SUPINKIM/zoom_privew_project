function throttleScrollEvent(fn, removeFn) {
  let lastTime = 0;
  let lastHash = null;
  return (count) => {
    if (lastHash && lastHash !== window.location.hash) {
      removeFn();
      return;
    }
    if (window.scrollY + window.innerHeight >= document.body.clientHeight) {
      const now = Date.now();
      if (now - lastTime > 2350 && count < 40) {
        fn();
        lastTime = now;
        lastHash = window.location.hash;
      } else if (count > 40) {
        lastHash = null;
        removeFn();
      } else {
        return;
      }
    }
  };
}

export default throttleScrollEvent;
