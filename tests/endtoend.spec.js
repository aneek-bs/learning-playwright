const { test, expect } = require('@playwright/test');

test('End to End Test', async ({ page }) => {
  const productName = 'ZARA COAT 3';
  const products = await page.locator('.card-body');

  const emailId = 'clancy@gmail.com';

  //Login
  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.locator('#userEmail').fill(emailId);
  await page.locator('#userPassword').fill('Clancy@2025');
  await page.locator('#login').click();
  await page.waitForLoadState('networkidle');
  await products.first().waitFor();

  //Add to cart the desired product
  const titles = await page.locator('.card-body b').allTextContents();
  const prodCount = await products.count();
  for (let i = 0; i < prodCount; i++) {
    if ((await products.nth(i).locator('b').textContent()) === productName) {
      await products.nth(i).locator('text=" Add To Cart"').click();
      break;
    }
  }

  //Validate that the added product is there in the cart
  await page.locator('[routerLink*="cart"]').click();
  await page.locator('div li').first().waitFor();
  expect(
    await page.locator('h3:has-text("ZARA COAT 3")').isVisible()
  ).toBeTruthy();

  await page.locator('text="Checkout"').click();

  //Select dropdown from auto-suggestive dropdown
  await page.locator('[placeholder*="Country"]').pressSequentially('ind');
  const options = await page.locator('.ta-results');
  await options.waitFor();
  const optionCounts = await options.locator('button').count();
  for (let i = 0; i < optionCounts; i++) {
    if (
      (await options.locator('button').nth(i).textContent()).trim() === 'India'
    ) {
      await options.locator('button').nth(i).click();
      break;
    }
  }

  //Checkout
  await expect(page.locator('.user__name label')).toHaveText(emailId);
  await page.locator('.action__submit').click();

  //Verify Thank you page
  await expect(page.locator('.hero-primary')).toHaveText(
    ' Thankyou for the order. '
  );

  //Grab the order ID from the thank you page
  const orderId = await page
    .locator('.em-spacer-1 .ng-star-inserted')
    .textContent();
  console.log(`Order created --- ${orderId}`);

  //Now go to my orders
  await page.locator('button[routerlink*="myorders"]').click();
  await page.waitForLoadState('networkidle');
  await page.locator('tbody tr').first().waitFor();

  //View the order which we just placed by validating against the order ID
  const orders = await page.locator('tbody tr');

  for (let i = 0; i < (await orders.count()); i++) {
    const rowId = await orders.nth(i).locator('th').textContent();
    if (orderId.includes(rowId)) {
      await orders.nth(i).locator('button').first().click();
      break;
    }
  }

  //Assertions in  view order page
  await expect(page.locator('.email-preheader p')).toHaveText(
    'Thank you for Shopping With Us'
  );

  expect(
    orderId.includes(await page.locator('.col-text').textContent())
  ).toBeTruthy();

  await page.pause();
});

test('End to End Test using special locators', async ({ page }) => {
  const productName = 'ZARA COAT 3';
  const products = await page.locator('.card-body');

  const emailId = 'clancy@gmail.com';

  //Login
  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.getByPlaceholder('email@example.com').fill(emailId);
  await page.getByPlaceholder('enter your passsword').fill('Clancy@2025');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');
  await products.first().waitFor();

  //Add to cart the desired product
  await products
    .filter({ hasText: productName })
    .getByRole('button', { name: 'Add To Cart' })
    .click();

  //Validate that the added product is there in the cart
  await page.getByRole('list').getByRole('button', { name: 'Cart' }).click();
  await page.locator('div li').first().waitFor();

  await expect(page.getByText('ZARA COAT 3')).toBeVisible();

  await page.getByRole('button', { name: 'Checkout' }).click();

  //Select dropdown from auto-suggestive dropdown
  await page.getByPlaceholder('Country').pressSequentially('ind');

  const options = await page.locator('.ta-results');
  await options.waitFor();
  await options.getByRole('button', { name: /India$/ }).click();

  //Checkout
  await expect(page.locator('.user__name label')).toHaveText(emailId);
  await page.getByText('PLACE ORDER').click();

  //Verify Thank you page
  await expect(page.getByText(' Thankyou for the order. ')).toBeVisible();
});
