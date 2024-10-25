module.exports = function override(config, env) {
  // Add the fallback configuration
  config.resolve.fallback = {
    ...config.resolve.fallback,
    url: false,
    fs: false,
    // Add other fallbacks as needed
  };
  return config;
};
