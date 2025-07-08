const PuppeteerEnvironment = require('jest-environment-puppeteer');

class CustomEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();
    // Add any custom setup here
  }

  async teardown() {
    // Add any custom teardown here
    await super.teardown();
  }
}

module.exports = CustomEnvironment;