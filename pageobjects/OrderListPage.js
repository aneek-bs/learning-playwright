class OrderListPage {
  constructor(page) {
    this.page = page;
    this.orderRows = page.locator('tbody tr');
  }

  async verifyAndViewOrder(orderId) {
    //Now go to my orders

    await this.page.waitForLoadState('networkidle');
    await this.orderRows.first().waitFor();

    //View the order which we just placed by validating against the order ID

    for (let i = 0; i < (await this.orderRows.count()); i++) {
      const rowId = await this.orderRows.nth(i).locator('th').textContent();
      if (orderId.includes(rowId)) {
        await this.orderRows.nth(i).locator('button').first().click();
        break;
      }
    }
  }
}

module.exports = { OrderListPage };
