const base = require('@playwright/test');

exports.customTest = base.test.extend({
  testDataForOrder: {
    productName: 'ZARA COAT 3',
    password: 'Clancy@2025',
    emailId: 'clancy@gmail.com',
  },
});
