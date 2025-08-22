import { test, expect } from '@playwright/test';


test('full checkin-checkout flow', async ({ page }) => {
  await checkInAllBoats(page)
  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('mikeway@webwrights.co.uk');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('rowlocks');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Blue Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'w' }).click();
  await page.getByRole('combobox', { name: 'Day of Month' }).locator('span').click();
  await page.getByRole('option', { name: '14' }).click();
  await page.getByText('Select month').click();
  await page.getByRole('option', { name: 'July' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Sailability' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Home' }).click();
  await page.getByRole('radio', { name: 'Check In' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Blue Rib' }).click();
  await page.getByRole('option', { name: 'Blue Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('checkbox', { name: 'I am Mike Way.' }).check();
  await page.getByRole('checkbox', { name: 'I have returned the key.' }).check();
  await page.getByRole('checkbox', { name: 'I have refueled the boat.' }).check();
  await page.getByRole('radio', { name: 'Yes' }).check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Fuel system issue' }).click();
  await page.getByRole('textbox', { name: 'Details' }).click();
  await page.getByRole('textbox', { name: 'Details' }).fill('Some text');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Thank You')).toBeVisible();
});

async function checkInAllBoats(page) {
  await page.goto('http://localhost:3000/admin-login');
  await page.getByRole('textbox', { name: 'Email:' }).fill('vice@exe-sailing-club.org');
  await page.getByRole('textbox', { name: 'Password:' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto('http://localhost:3000/admin');
  await page.getByRole('button', { name: 'Check In All Boats' }).click();
}



test('Checking with multiple issues', async ({ page }) => {
  await checkInAllBoats(page)
  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('mikeway@webwrights.co.uk');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('rowlocks');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Blue Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'w' }).click();
  await page.getByRole('combobox', { name: 'Day of Month' }).locator('span').click();
  await page.getByRole('option', { name: '14' }).click();
  await page.getByText('Select month').click();
  await page.getByRole('option', { name: 'July' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Sailability' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Home' }).click();
  await page.getByRole('radio', { name: 'Check In' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Blue Rib' }).click();
  await page.getByRole('option', { name: 'Blue Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('checkbox', { name: 'I am Mike Way.' }).check();
  await page.getByRole('checkbox', { name: 'I have returned the key.' }).check();
  await page.getByRole('checkbox', { name: 'I have refueled the boat.' }).check();
  await page.getByRole('radio', { name: 'Yes' }).check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Fuel system issue' }).click();
  await page.getByRole('option', { name: 'Electrical issue' }).click();
  await page.getByRole('option', { name: 'Propeller problem' }).click();
  await page.locator('div').filter({ hasText: 'Details' }).nth(3).click();
  await page.getByRole('textbox', { name: 'Details' }).fill('The prop is bent and the nav light flashes');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Thank You')).toBeVisible();
  await downloadReport(page);
});


async function downloadReport(page) {
  await page.goto('http://localhost:3000/admin-login');
  await page.getByRole('textbox', { name: 'Email:' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).fill('vice @exe-sailing-club.org');
  await page.getByRole('textbox', { name: 'Email:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Generate Log Reports' }).click();
  const download = await downloadPromise;
  //await download.saveAs('/path/to/save/at/' + download.suggestedFilename());
  const readStream = await download.createReadStream();
  readStream.on('data', (chunk) => {
    // chunk seems to be a bytearray
    console.log(`Received ${chunk.length} bytes of data.`);
    // Process the chunk as a csv
    const csvData = chunk.toString('utf-8');
    csvData.split('\n').forEach((line) => {
      console.log(`CSV Line: ${line}`);
      console.log(`Processed CSV Data: ${csvData}`);
    });
  });
}
