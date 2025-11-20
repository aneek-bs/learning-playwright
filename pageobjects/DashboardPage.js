class DashboardPage {
  constructor(page) {
    this.page = page;
    this.products = page.locator('.card-body');
    this.cartBtn = page.locator('[routerLink*="cart"]');
  }

  async addProdToCart(productName) {
    await this.products.first().waitFor();

    //Add to cart the desired product
    const prodCount = await this.products.count();
    for (let i = 0; i < prodCount; i++) {
      if (
        (await this.products.nth(i).locator('b').textContent()) === productName
      ) {
        await this.products.nth(i).locator('text=" Add To Cart"').click();
        break;
      }
    }

    //Validate that the added product is there in the cart
    await this.cartBtn.click();
  }
}

module.exports = { DashboardPage };
