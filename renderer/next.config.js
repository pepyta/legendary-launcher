module.exports = {
  images: {
    domains: [
      'cdn1.epicgames.com'
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }

    return config;
  },
};
