const { test } = require('@playwright/test');
const { customTest } = require('../utils/test-base');
const { POManager } = require('../pageobjects/POManager'); //Import the page object manager class

const dataSet = JSON.parse(
  JSON.stringify(require('../utils/placeOrderTestData.json'))
); //Convert the JSON into a JS object

//Run a test with different sets of data (as obtained from the JSON file)
for (const data of dataSet) {
  test(`Sec 14- End to End Test Using Page Object ${data.productName}`, async ({
    page,
  }) => {
    const poManager = new POManager(page);

    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashBoardPage();
    const cartPage = poManager.getCartPage();
    const orderPage = poManager.getOrderPage();
    const thankyouPage = poManager.getThankYouPage();
    const orderListPage = poManager.getOrderListPage();
    const viewOrderPage = poManager.getViewOrderPage();

    //Login
    await loginPage.goToLoginPage();
    await loginPage.validLogin(data.emailId, data.password);

    //Add product to Cart
    await dashboardPage.addProdToCart(data.productName);

    //verify the cart and checkout
    await cartPage.verifyAndCheckout(data.productName);

    //Place the order
    await orderPage.placeOrder(data.emailId);

    //Grab the orderId
    const orderId = await thankyouPage.verifyAndGrabOrderId();

    //View the order from order list page

    await orderListPage.verifyAndViewOrder(orderId);

    //Verify the order
    await viewOrderPage.verifyOrder(orderId);
  });
}

//A custom test which has original test plus a fixture containing all the test data (as imported from test-base)
customTest(
  'Sec 14- Client App Login using test data fixture',
  async ({ page, testDataForOrder }) => {
    const poManager = new POManager(page);

    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashBoardPage();
    const cartPage = poManager.getCartPage();

    //Login
    await loginPage.goToLoginPage();
    await loginPage.validLogin(
      testDataForOrder.emailId,
      testDataForOrder.password
    );

    //Add product to Cart
    await dashboardPage.addProdToCart(testDataForOrder.productName);

    //verify the cart and checkout
    await cartPage.verifyAndCheckout(testDataForOrder.productName);
  }
);
