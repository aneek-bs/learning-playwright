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

const fakePayLoadOrders = { data: [], message: 'No Orders' };

let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext(); //Open a new API Context
  const apiUtils = new APIUtils(apiContext, loginPayload); //pass on the context, and the login Payload as a APIUtils object
  response = await apiUtils.getOrderId(orderPayload); //Fetch the response object {orderId:..., token:..}
});

test('@network Sec 12- Intercepting Network and creating a fake empty page scenario', async ({
  page,
}) => {
  //Login by injecting into the local storage
  await page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, response.token); //Fetch the token property from response object

  await page.goto('https://rahulshettyacademy.com/client/');

  await page.pause();

  await page.route(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
    async (route) => {
      //Intercepting response
      const response = await page.request.fetch(route.request());
      /*✔ Step 1 — Take the intercepted request
      route.request() = the request Playwright stopped

      ✔ Step 2 — Send that same request to the backend manually
      page.request.fetch() = a way to call the API without the page knowing

      ✔ Step 3 — Get the real backend response
      The backend sends back things like: HTTP status (200), Headers (content-type, cache-control, etc.), Cookies, Timing data

      You save that response object into response.*/

      let body = JSON.stringify(fakePayLoadOrders);
      route.fulfill({
        response,
        body, //Injecting my own custom body to the browser - which will fake the empty order list
      });
    }
  );

  //Now go to my orders
  await page.locator('button[routerlink*="myorders"]').click();
  await page.waitForLoadState('networkidle');

  await expect(page.locator('.table-responsive')).toHaveText(
    ' You have No Orders to show at this time. Please Visit Back Us '
  );
});

test('@network Sec 12- Security Test Request Intercept', async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, response.token); //Fetch the token property from response object

  await page.goto('https://rahulshettyacademy.com/client/');
  await page.locator('button[routerlink*="myorders"]').click();
  await page.waitForLoadState('networkidle');

  await page.locator('tbody tr').first().waitFor();

  //(THE MAIN PART) --- Intercepting the request (sending our own request)
  //In previous test, it was, we were intercept the response. After we recieved the response, we modified it and sent to browser.
  //In here, before even recieving any response, we directly send the wrong request
  await page.route(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
    (route) =>
      route.continue({
        url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=691dd15b5008f6a9657567',
      })
  );

  await page.locator('button:has-text("View")').first().click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.blink_me')).toHaveText(
    'You are not authorize to view this order'
  );
});

test('@network Sec12- Aborting Network Response', async ({ page }) => {
  await page.route('**/*.css', (route) => {
    route.abort();
  });
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  await page.pause();
});
