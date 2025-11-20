const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutCard = page.locator('div li');
    this.checkoutBtn = page.locator('text="Checkout"');
  }

  async verifyAndCheckout(productName) {
    await this.checkoutCard.first().waitFor();
    expect(
      await this.page.locator('h3:has-text("' + productName + '")').isVisible()
    ).toBeTruthy();
    await this.checkoutBtn.click();
  }
}

module.exports = { CartPage };
