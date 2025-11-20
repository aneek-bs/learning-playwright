const { expect } = require('@playwright/test');

class ViewOrderPage {
  constructor(page) {
    this.page = page;
    this.thankYouHeader = page.locator('.email-preheader p');
    this.orderIdTxt = page.locator('.col-text');
  }

  async verifyOrder(orderId) {
    //Assertions in  view order page
    await expect(this.thankYouHeader).toHaveText(
      'Thank you for Shopping With Us'
    );

    expect(orderId.includes(await this.orderIdTxt.textContent())).toBeTruthy();
  }
}
module.exports = { ViewOrderPage };
