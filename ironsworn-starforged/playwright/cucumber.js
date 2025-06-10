module.exports = {
  default: {
    paths: ['playwright/**/*.feature'],
    dryRun: false,
    format: ['progress-bar', 'summary'],
    formatOptions: {
      colorsEnabled: true,
      snippetInterface: 'async-await',
    },
    require: ['playwright/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
  },
};
