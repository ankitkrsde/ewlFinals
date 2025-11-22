const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log("🚀 Serving from cache:", key);
      return res.json(cachedResponse);
    }

    // Override res.json to cache response
    const originalJson = res.json;
    res.json = function (data) {
      cache.set(key, data, duration);
      originalJson.call(this, data);
    };

    next();
  };
};

module.exports = cacheMiddleware;
