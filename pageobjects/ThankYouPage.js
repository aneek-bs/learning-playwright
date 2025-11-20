const { expect } = require('@playwright/test');

class ThankYouPage {
  constructor(page) {
    this.page = page;
    this.thankyouHeader = page.locator('.hero-primary');
    this.orderIdTxt = page.locator('.em-spacer-1 .ng-star-inserted');
    this.orderListBtn = page.locator('button[routerlink*="myorders"]');
  }
  async verifyAndGrabOrderId() {
    //Verify Thank you page
    await expect(this.thankyouHeader).toHaveText(' Thankyou for the order. ');

    //Grab the order ID from the thank you page
    const orderId = await this.orderIdTxt.textContent();
    console.log(`Order created --- ${orderId}`);
    await this.orderListBtn.click();
    return orderId;
  }
}
module.exports = { ThankYouPage };
