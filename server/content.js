const express = require('express');
const router = express.Router();

const life = require('./life.json');
const food = require('./food.json');
const travel = require('./travel.json');
const culture = require('./culture.json');

const getLists = (path) => {
  switch (path) {
    case '/life':
      return life;
    case '/food':
      return food;
    case '/travel':
      return travel;
    case '/culture':
      return culture;
    default:
      return null;
  }
};

router.use('/', (req, res) => {
  const {
    _parsedUrl: { pathname },
  } = req;

  const size = +req.query?.length;
  const start = +req.query?.start;
  const lists = getLists(pathname);

  if (lists) {
    return size
      ? res.json({ state: 200, data: lists.slice(start, start + size) })
      : res.json({ state: 200, data: lists });
  } else {
    const error = new Error('not found');
    error.status = 404;
    throw error;
  }
});

module.exports = router;
