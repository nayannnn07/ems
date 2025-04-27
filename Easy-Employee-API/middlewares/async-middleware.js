// middlewares/async-middleware.js

const asyncMiddleware = (fn) => {
    return function (req, res, next) {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  
  module.exports = asyncMiddleware;
  