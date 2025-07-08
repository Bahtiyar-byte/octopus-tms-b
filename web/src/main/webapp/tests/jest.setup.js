// Extend Jest matchers
expect.extend({
  toBeVisible: async (received) => {
    try {
      await received.waitForSelector({ visible: true, timeout: 5000 });
      return {
        message: () => 'Element is visible',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => 'Element is not visible',
        pass: false,
      };
    }
  },
});