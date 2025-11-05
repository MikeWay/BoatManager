import { test, expect } from '@playwright/test';
import { adminLogon } from './e2eTestUtils';

test('create and clear faults', async ({ page }) => {
    await adminLogon(page);
    await page.getByRole('button', { name: 'Clear all Boat Faults -' }).click();
    await page.goto('http://localhost:4200/');
    
    await page.getByRole('radio', { name: 'Check In' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('vice@exe-sailing-club.org');
    await page.getByRole('textbox', { name: 'Email' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('rowlocks');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Home' }).click();
    await page.getByRole('radio', { name: 'Check Out' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('option', { name: 'Yellow Rib' }).click();
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
    await page.getByRole('option', { name: 'Yellow Rib' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('checkbox', { name: 'I am Mike Way.' }).check();
    await page.getByRole('checkbox', { name: 'I have returned the key.' }).check();
    await page.getByRole('checkbox', { name: 'I have refueled the boat.' }).check();
    await page.getByRole('textbox', { name: 'Engine Hours' }).click();
    await page.getByRole('radio', { name: 'Yes' }).check();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('option', { name: 'Engine failure' }).click();
    await page.getByRole('textbox', { name: 'Fault Detail' }).click();
    await page.getByRole('textbox', { name: 'Fault Detail' }).fill('Smoke!');
    await page.getByRole('button', { name: 'Done' }).click();
    await page.getByRole('option', { name: 'Hull damage' }).click();
    await page.getByRole('textbox', { name: 'Fault Detail' }).click();
    await page.getByRole('textbox', { name: 'Fault Detail' }).fill('Oops sorry!');
    await page.getByRole('button', { name: 'Done' }).click();
    await page.getByRole('button', { name: 'Next' }).click();


    await page.goto('http://localhost:3000/admin');
    await page.getByRole('link', { name: 'Boats with Issues' }).click();
    await expect(page.getByRole('cell', { name: '2' })).toBeDefined();
    await page.getByRole('link', { name: 'View Issues' }).click();
    await expect(page.getByRole('cell', { name: 'Smoke!' })).toBeDefined();
    await expect(page.getByRole('cell', { name: 'Oops sorry!' })).toBeDefined();
    await page.getByRole('row', { name: 'Hull damage Oops sorry! Clear' }).getByRole('button').click();
    await page.getByRole('button', { name: 'Yes' }).click();
    //await expect(page.getByRole('cell', { name: 'Oops sorry!' })).toBeUndefined();
    await page.getByRole('row', { name: 'Engine failure Smoke! Clear' }).getByRole('button').click();
    await page.getByRole('button', { name: 'Yes' }).click();
    // await page.getByRole('button', { name: 'Clear' }).click();
    // await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.getByRole('heading', { name: 'All boats are OK!' })).toBeDefined();
});




