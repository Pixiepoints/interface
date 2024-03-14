/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const { NEXT_PUBLIC_APP_ENV } = process.env;
const pluginConfig = require('./build.config/plugin');
const development = require('./build.config/development');
const test = require('./build.config/test');
const production = require('./build.config/production');

const config = {
  development: development,
  test: test,
  production: production,
}[NEXT_PUBLIC_APP_ENV];

module.exports = withPlugins(pluginConfig, config);
