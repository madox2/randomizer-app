// Static configuration lives in app.json. This file only adds the optional
// base URL used when the web build is hosted in a sub directory,
// e.g. EXPO_BASE_URL=/randomizer-app for GitHub Pages.
module.exports = ({config}) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.EXPO_BASE_URL && {baseUrl: process.env.EXPO_BASE_URL}),
  },
})
