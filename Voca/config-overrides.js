const webpack = require("webpack");

module.exports = function override(config, env) {
  // Add fallback for the 'util' module
  config.resolve.fallback = {
    // eslint-disable-next-line no-undef
    util: require.resolve("util/"),
  };

  return config;
};
