import { test, expect, Page } from '@playwright/test';

const ribNames = ['Blue Rib', 'Yellow Rib', 'White Rib', 'Orange Rib', 'Grey Rib', 'Tornado II'];
test('check in all boats', async ({ page }) => {
  await checkInAllBoats(page);
});

test('full checkin-checkout flow', async ({ page }) => {
  await checkInAllBoats(page)
  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await logInIfNeeded(page);
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
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('checkbox', { name: 'I am Mike Way.' }).check();
  await page.getByRole('checkbox', { name: 'I have returned the key.' }).check();
  await page.getByRole('checkbox', { name: 'I have refueled the boat.' }).check();
  await page.getByRole('radio', { name: 'Yes' }).check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Fuel system issue' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Engine dies - suspect fuel system');
  await page.getByRole('button', { name: 'Done' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Thank You')).toBeVisible();
  const csvContent: string = await downloadReport(page);
  const lines = csvContent.split(/\r?\n/);
  const nonEmpty = lines.filter((l) => l.trim() !== '');
  const lastLine = nonEmpty[nonEmpty.length - 1] ?? '';
  const penultimateLine = nonEmpty.length >= 2 ? nonEmpty[nonEmpty.length - 2] : '';

  const cols = lastLine
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/) // split on commas not inside quotes
    .map((c) => c.replace(/^"(.*)"$/, '$1').trim());

  const penCols = penultimateLine
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((c) => c.replace(/^"(.*)"$/, '$1').trim());

  expect(penCols[0].toLowerCase()).toBe('check out');
  expect(cols[0].toLowerCase()).toBe('check in');
  expect(cols[1]).toBe('Blue Rib');
  expect(cols[5]).toBe('Sailability');
  expect(cols[6]).toBe('Fuel system issue');
  await page.getByRole('link', { name: 'Boats with Issues' }).click();
  expect(page.getByRole('cell', { name: '2' })).toBeDefined();
  await page.getByRole('link', { name: 'View Issues' }).click();
  expect(page.getByRole('cell', { name: 'Engine dies' })).toBeDefined();
  expect(page.getByRole('cell', { name: 'Steering leaking' })).toBeDefined();
});

async function checkInAllBoats(page) {
  await adminLogon(page);
  await page.goto('http://localhost:3000/admin');
  await page.getByRole('button', { name: 'Check In All Boats' }).click();
}



test('Checkin Blue Rib with multiple issues', async ({ page }) => {
  await doCheckinWithIssues(page, 'Blue Rib', ['Electrical issue', 'Propeller problem']);
  //await downloadReport(page);
});


test('Checkin Blue Rib with different issues', async ({ page }) => {
  await doCheckinWithIssues(page, 'Blue Rib', ['Hull damage', 'Fuel system issue']);
  //await downloadReport(page);
});


test('Checkin random boats with random issues (to generate test data)', async ({ page }) => {
  const issues = ['Engine failure', 'Electrical issue', 'Hull damage', 'Propeller problem', 'Fuel system issue', 'Steering malfunction'];
  const boatsNames = ['Yellow Rib', 'Blue Rib', 'Spare Rib', 'Grey Rib'];

  // loop 10 times
  for (let i = 0; i < 10; i++) {
    const randomBoat = boatsNames[Math.floor(Math.random() * boatsNames.length)];
    // randomly create 1 - 4 issues
    const randomIssues = issues.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1);
    await doCheckinWithIssues(page, randomBoat, randomIssues);
  }
  //await downloadReport(page);
});

test('check out then in no faults - storing engine hours', async ({ page }) => {
  test.setTimeout(120_000);
  const startTotalEngineHours = await getTotalEngineHours(page);
  await checkOutThenIn_NoFaults(page, '05:00', 'Sailability');
  await checkOutThenIn_NoFaults(page, '01:20', 'Dinghy Racing');
  await checkOutThenIn_NoFaults(page, '02:30', 'Dinghy Cruising');
  await checkOutThenIn_NoFaults(page, '03:40', 'Cruiser Racing');
  await checkOutThenIn_NoFaults(page, '04:50', 'Training');
  await checkOutThenIn_NoFaults(page, '06:00', 'Other');
  await checkOutThenIn_NoFaults(page, '02:00', 'Sailability');
  await checkOutThenIn_NoFaults(page, '03:20', 'Dinghy Racing');
  await checkOutThenIn_NoFaults(page, '01:30', 'Dinghy Cruising');
  await checkOutThenIn_NoFaults(page, '01:40', 'Cruiser Racing');
  await checkOutThenIn_NoFaults(page, '05:50', 'Training');
  await checkOutThenIn_NoFaults(page, '01:00', 'Other');
  const endTotalEngineHours = await getTotalEngineHours(page);
  const expectedHoursToAdd = 38 + 40 / 60; // 36.1666667
  const actualHoursAdded = endTotalEngineHours - startTotalEngineHours;
  // allow a small delta for rounding errors
  const delta = Math.abs(actualHoursAdded - expectedHoursToAdd);
  expect(delta).toBeLessThan(0.01); 

});


async function adminLogon(page: any) {
  await page.goto('http://localhost:3000/admin-login');
  await page.getByRole('textbox', { name: 'Email:' }).fill('vice@exe-sailing-club.org');
  await page.getByRole('textbox', { name: 'Password:' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
}

async function getTotalEngineHours(page: any): Promise<number> {
  await adminLogon(page);
  await page.getByRole('link', { name: 'List Engine Hours by Use', exact: true }).click();
  const textContent = await page.locator("#totalEngineHours").textContent();
  return parseFloat(textContent);
}
async function doCheckinWithIssues(page: Page, ribName: string, issues: string[]) {
  test.setTimeout(120_000);
  await checkInAllBoats(page);
  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await logInIfNeeded(page);
  await page.getByRole('option', { name: ribName }).click();
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
  await page.getByRole('option', { name: ribName }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('checkbox', { name: 'I am Mike Way.' }).check(); async function checkAllBoatsAreOK(page: any) {
    await expect(page.getByRole('heading', { name: 'All boats are OK!' })).toBeDefined();
  }
  await page.getByRole('checkbox', { name: 'I have returned the key.' }).check();
  await page.getByRole('checkbox', { name: 'I have refueled the boat.' }).check();
  await page.getByRole('radio', { name: 'Yes' }).check();
  await page.getByRole('button', { name: 'Next' }).click();
  for (const issue of issues) {
    await expect(page.getByText('Tell us')).toBeVisible();
    await page.getByRole('option', { name: issue }).click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill(issue + ' - details of the problem');
    await page.getByRole('button', { name: 'Done' }).click();
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Thank You')).toBeVisible();
}



/*


            "Sailability",
            "Maintenance",
            "Dinghy Racing",
            "Dinghy Cruising",
            "Cruiser Racing",
            "Training",
            "Other"
            */
async function downloadReport(page: Page): Promise<string> {
  await page.goto('http://localhost:3000/admin-login');
  await page.getByRole('textbox', { name: 'Email:' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).fill('vice@exe-sailing-club.org');
  await page.getByRole('textbox', { name: 'Email:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Generate Log Reports' }).click();
  const download = await downloadPromise;
  //await download.saveAs('/path/to/save/at/' + download.suggestedFilename());
  const readStream = await download.createReadStream();
  // readStream.on('data', (chunk) => {
  //   // chunk seems to be a bytearray
  //   console.log(`Received ${chunk.length} bytes of data.`);
  //   // Process the chunk as a csv
  //   const csvData = chunk.toString('utf-8');
  //   csvData.split('\n').forEach((line) => {
  //     console.log(`CSV Line: ${line}`);
  //     console.log(`Processed CSV Data: ${csvData}`);
  //   });
  // });
  // Read the stream into memory, split into lines and return the last non-empty line.
  const chunks: Buffer[] = [];
  for await (const chunk of readStream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const csvContent = Buffer.concat(chunks).toString('utf8');
  const lines = csvContent.split(/\r?\n/);
  let lastLine = '';
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== '') {
      lastLine = lines[i];
      break;
    }
  }
  console.log('Last line of CSV:', lastLine);
  return csvContent;
}

/*
Reason should be one of:         checkout_reasons: [
            "Sailability",
            "Maintenance",
            "Dinghy Racing",
            "Dinghy Cruising",
            "Cruiser Racing",
            "Training",
            "Other"
        ],
        */
async function checkOutThenIn_NoFaults(page: Page, hours: string, reason: string) {
  // randomly select a string from ribNames
  const randomRibName = ribNames[Math.floor(Math.random() * ribNames.length)];
  await checkInAllBoats(page)
  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await logInIfNeeded(page);
  await page.getByRole('option', { name: randomRibName }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'w' }).click();
  await page.getByRole('combobox', { name: 'Day of Month' }).locator('span').click();
  await page.getByRole('option', { name: '14' }).click();
  await page.getByText('Select month').click();
  await page.getByRole('option', { name: 'July' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: reason }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Home' }).click();
  await page.getByRole('radio', { name: 'Check In' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: randomRibName }).click();
  //await page.getByRole('option', { name: 'Blue Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('checkbox', { name: 'I am Mike Way.' }).check();
  await page.getByRole('checkbox', { name: 'I have returned the key.' }).check();
  await page.getByRole('checkbox', { name: 'I have refueled the boat.' }).check();
  await page.getByRole('textbox', { name: 'Engine Hours' }).click();
  await page.getByRole('textbox', { name: 'Engine Hours' }).fill(hours);
  await page.getByRole('radio', { name: 'No' }).check();
  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByText('Thank You')).toBeVisible();
  await page.getByRole('button', { name: 'Home' }).click();

}


test('check orange out and in with two faults', async ({ page }) => {

  await checkInAllBoats(page);
  await clearAllIssues(page);
  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await logInIfNeeded(page);
  await page.getByRole('option', { name: 'Orange Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'w' }).click();
  await page.getByRole('combobox', { name: 'Day of Month' }).locator('span').click();
  await page.getByRole('option', { name: '14' }).click();
  await page.getByText('Select month').click();
  await page.getByRole('option', { name: 'July' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Cruiser Racing' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Home' }).click();
  await page.getByRole('radio', { name: 'Check In' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Orange Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('checkbox', { name: 'I am Mike Way.' }).check();
  await page.getByRole('checkbox', { name: 'I have returned the key.' }).check();
  await page.getByRole('checkbox', { name: 'I have returned the key.' }).check();
  await page.getByRole('textbox', { name: 'Engine Hours' }).click();
  await page.getByRole('radio', { name: 'Yes' }).check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Engine failure' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Engine dies');
  await page.getByRole('button', { name: 'Done' }).click();
  await page.getByRole('option', { name: 'Steering malfunction' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('Steering leaking');
  await page.getByRole('button', { name: 'Done' }).click();
  await page.getByRole('button', { name: 'Next' }).click();


  adminLogon(page);
  await page.getByRole('link', { name: 'Boats with Issues' }).click();
  const table = page.locator('table').first();
  const rows = table.locator('tr');
  await expect(rows).toHaveCount(2); // header + one data row
  const headerCount = await table.locator('th').count();
  expect(headerCount).toBeGreaterThan(0);
  expect(page.getByRole('cell', { name: '2' })).toBeDefined();
  await page.getByRole('row', { name: 'Orange Rib 2 View Issues' }).getByRole('link').click();
  expect(page.getByRole('cell', { name: 'Engine dies' })).toBeDefined();
  expect(page.getByRole('cell', { name: 'Steering leaking' })).toBeDefined();
});

async function logInIfNeeded(page: Page) {
  if (await page.isVisible('#loginForm')) {
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('mikeway@webwrights.co.uk');
    await page.getByRole('textbox', { name: 'Email' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('rowlocks');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
  }
}

async function clearAllIssues(page: Page) {
  await adminLogon(page);
  await page.goto('http://localhost:3000/admin');
  await page.getByRole('button', { name: 'Clear all Boat Faults - Testing Only' }).click();
}
