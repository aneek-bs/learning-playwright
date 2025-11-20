const { LoginPage } = require('./LoginPage');
const { DashboardPage } = require('./DashboardPage');
const { CartPage } = require('./CartPage');
const { OrderListPage } = require('./OrderListPage');
const { OrderPage } = require('./OrderPage');
const { ThankYouPage } = require('./ThankYouPage');
const { ViewOrderPage } = require('./ViewOrderPage');

class POManager {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.cartPage = new CartPage(page);
    this.orderListPage = new OrderListPage(page);
    this.orderPage = new OrderPage(page);
    this.thankYouPage = new ThankYouPage(page);
    this.viewOrderPage = new ViewOrderPage(page);
  }

  getLoginPage() {
    return this.loginPage;
  }

  getDashBoardPage() {
    return this.dashboardPage;
  }

  getCartPage() {
    return this.cartPage;
  }

  getOrderListPage() {
    return this.orderListPage;
  }

  getOrderPage() {
    return this.orderPage;
  }

  getThankYouPage() {
    return this.thankYouPage;
  }

  getViewOrderPage() {
    return this.viewOrderPage;
  }
}
module.exports = { POManager };
