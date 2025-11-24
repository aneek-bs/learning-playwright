const { test, expect } = require('@playwright/test');

test('@web Sec 8- Playwright Unique getBy Locators', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/angularpractice/');

  //getByLabel - works great with checkboxes, radio buttons and selecting options from dropdowns
  await page.getByLabel('Check me out if you Love IceCreams!').click(); //Check the checkbox just by its label
  await page.getByLabel('Employed').click(); //Check the radio just by label
  await page.getByLabel('Gender').selectOption('Male');

  //getByPlaceholder - useful when we have placeholder attributes
  await page.getByPlaceholder('Password').fill('Password');

  //getByRole - for buttons, can be used when there is a button with <button> or .btn
  await page.getByRole('button', { name: 'Submit' }).click(); //name of the button

  //getBytext - scans the entire page for the text
  await expect(
    page.getByText('Success! The Form has been submitted successfully!.')
  ).toBeVisible();

  //getByRole - link with <a> tags
  await page.getByRole('link', { name: 'Shop' }).click();

  //Applies getByText on the cards returned by the locator - shifts the locator on the element where the text is returned
  await page
    .locator('app-card')
    .filter({ hasText: 'Nokia Edge' })
    .getByRole('button', { name: 'Add' })
    .click(); //Click on 'Add' button once inside the concerned card
});

test('@web Sec 8- Calendar Selections', async ({ page }) => {
  const monthNumber = '6';
  const date = '10';
  const year = '1975';

  const expectedDate = [monthNumber, date, year];

  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');
  await page.locator('.react-date-picker__inputGroup').click();
  await page.locator('.react-calendar__navigation__label__labelText').click();
  await page.locator('.react-calendar__navigation__label__labelText').click();

  const prevYearButton = page.locator(
    '.react-calendar__navigation__prev-button'
  );

  for (let i = 0; i < 12; i++) {
    const foundCount = await page.getByRole('button', { name: year }).count();
    if (foundCount > 0) {
      break;
    }
    await prevYearButton.click();
  }
  await page.getByRole('button', { name: year }).click();
  await page
    .locator('button.react-calendar__tile')
    .nth(Number(monthNumber) - 1)
    .click();
  await page.locator('//abbr[text()="' + date + '"]').click();

  const inputs = page.locator('input.react-date-picker__inputGroup__input');

  for (let i = 0; i < (await inputs.count()); i++) {
    expect(await inputs.nth(i).getAttribute('value')).toEqual(expectedDate[i]);
  }
});

test('@web Sec 9- Handling Web Dialogues, Frames and Event Listeners', async ({
  page,
}) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

  //Some more assertions
  await expect(page.locator('#displayed-text')).toBeVisible();
  await page.locator('#hide-textbox').click();
  await expect(page.locator('#displayed-text')).toBeHidden();

  //Accepting dialogue boxes
  page.on('dialog', (dialog) => dialog.accept());
  await page.locator('#confirmbtn').click();

  //Hover over an item
  await page.locator('#mousehover').hover();

  //handling frames
  const childPage = page.frameLocator('#courses-iframe');
  await childPage.locator('a[href*="all-access-subscription"]').first().click();
  await expect(childPage.locator('.hero-shapes div span')).toHaveText(
    'Premium Access Plans'
  );
});
