const { expect } = require('@playwright/test');

class OrderPage {
  constructor(page) {
    this.page = page;
    this.countryDropdown = page.locator('[placeholder*="Country"]');
    this.countryOptions = page.locator('.ta-results');
    this.countryOption = this.countryOptions.locator('button');
    this.emailLabel = page.locator('.user__name label');
    this.placeOrderBtn = page.locator('.action__submit');
  }
  async placeOrder(emailId) {
    //Select dropdown from auto-suggestive dropdown
    await this.countryDropdown.pressSequentially('ind');

    await this.countryOptions.first().waitFor();
    const optionCounts = await this.countryOption.count();
    for (let i = 0; i < optionCounts; i++) {
      if ((await this.countryOption.nth(i).textContent()).trim() === 'India') {
        await this.countryOption.nth(i).click();
        break;
      }
    }

    //Checkout
    await expect(this.emailLabel).toHaveText(emailId);
    await this.placeOrderBtn.click();
  }
}

module.exports = { OrderPage };
