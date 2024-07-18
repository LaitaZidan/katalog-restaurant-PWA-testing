const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 140000,
  },
});
