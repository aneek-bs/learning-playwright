const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');
//{APIUtils} fetches the class. If we import just APIUtils, it will fetch the entire object whose property is the class

const loginPayload = {
  userEmail: 'clancy@gmail.com',
  userPassword: 'Clancy@2025',
};

const orderPayload = {
  orders: [
    { country: 'United Kingdom', productOrderedId: '68a961459320a140fe1ca57a' },
  ], //Each Product has an unique product ID
};

let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext(); //Open a new API Context
  const apiUtils = new APIUtils(apiContext, loginPayload); //pass on the context, and the login Payload as a APIUtils object
  response = await apiUtils.getOrderId(orderPayload); //Fetch the response object {orderId:..., token:..}
});

test('Sec 10- Client App End to End using API', async ({ page }) => {
  //Login by injecting into the local storage
  await page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, response.token); //Fetch the token property from response object

  await page.goto('https://rahulshettyacademy.com/client/');

  //Now go to my orders
  await page.locator('button[routerlink*="myorders"]').click();

  console.log(response.orderId);
  await page.waitForLoadState('networkidle');
  await page.locator('tbody tr').first().waitFor();

  //View the order which we just placed by validating against the order ID
  const orders = await page.locator('tbody tr');

  for (let i = 0; i < (await orders.count()); i++) {
    const rowId = await orders.nth(i).locator('th').textContent();
    if (response.orderId.includes(rowId)) {
      await orders.nth(i).locator('button').first().click();
      break;
    }
  }

  //Assertions in  view order page
  await expect(page.locator('.email-preheader p')).toHaveText(
    'Thank you for Shopping With Us'
  );

  expect(
    response.orderId.includes(await page.locator('.col-text').textContent())
  ).toBeTruthy();
});
