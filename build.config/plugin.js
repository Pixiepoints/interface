const { NEXT_PUBLIC_APP_ENV } = process.env;
const { withSentryConfig } = require('@sentry/nextjs');
const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  include: '.next',
  configFile: '.sentryclirc',
  urlPrefix: '~/_next',
  org: 'blockchainforever',
  project: 'points-web',
};
module.exports = [
  (nextConfig) =>
    NEXT_PUBLIC_APP_ENV === 'development' ? nextConfig : withSentryConfig(nextConfig, sentryWebpackPluginOptions),
];
