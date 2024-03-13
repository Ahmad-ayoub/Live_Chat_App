module.exports = function override(config, env) {
  config.resolve.fallback = {
    util: false,
    http: false,
    https: false,
    stream: false,
    assert: false,
    url: false,
    querystring: false,
    zlib: false,
    path: false,
  };

  return config;
};
