const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://petstore.swagger.io/v2',
    failOnStatusCode: false, //не фейлити тест, якщо статус код запиту не 2хх або 3хх 
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
