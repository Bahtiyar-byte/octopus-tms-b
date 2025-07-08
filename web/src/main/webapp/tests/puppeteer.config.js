module.exports = {
  launch: {
    headless: false,
    slowMo: 50,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080'
    ]
  },
  server: {
    url: 'http://localhost:3000',
    launchTimeout: 30000
  },
  testTimeout: 30000,
  viewport: {
    width: 1920,
    height: 1080
  }
};