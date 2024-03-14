const { override, useEslintRc } = require("customize-cra");

module.exports = override(useEslintRc(), (config) => {
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
});
