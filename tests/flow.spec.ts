import { test, expect, Page } from '@playwright/test';
import { adminLogon, logInToAppIfNeeded } from './e2eTestUtils';
import { log } from 'console';

test('check the e2e flow for check out (leaves Spare Rib checked out)', async ({ page }) => {
  await adminLogon(page);
  await page.goto('http://localhost:3000/admin');
  await page.getByRole('button', { name: 'Check In All Boats' }).click();
  await page.goto('http://localhost:4200/');

  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await logInToAppIfNeeded(page);  
  await page.getByRole('option', { name: 'Spare Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'w' }).click();
  await page.getByRole('combobox', { name: 'Day of Month' }).locator('span').click();
  await page.getByRole('option', { name: '14' }).click();
  await page.getByText('Select month').click();
  await page.getByRole('option', { name: 'July' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'Sailability' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Check-Out Complete')).toBeVisible();
  await expect(page.getByText('Mike Way')).toBeVisible();
  await expect(page.getByText('Spare Rib')).toBeVisible();

  await page.goto('http://localhost:3000/admin');
  await page.getByRole('link', { name: 'Show Boats Currently Checked Out' }).click();
  await expect(page.getByRole('cell', { name: 'Spare Rib' })).toBeDefined();
});

test('check that it fails if non-existent user specified', async ({ page }) => {
  await adminLogon(page);
  await page.goto('http://localhost:3000/admin');
  await page.getByRole('button', { name: 'Check In All Boats' }).click();
  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await logInToAppIfNeeded(page);
  await page.getByRole('option', { name: 'Spare Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('option', { name: 'w' }).click();
  await page.getByRole('combobox', { name: 'Day of Month' }).locator('span').click();
  await page.getByRole('option', { name: '13' }).click();
  await page.getByText('Select month').click();
  await page.getByRole('option', { name: 'July' }).click();
  await expect(page.getByRole('button', { name: 'Next' })).not.toBeEnabled();
});

test('check that previous is enabled from the boat selection screen', async ({ page }) => {
  await adminLogon(page);
  await page.goto('http://localhost:3000/admin');
  await page.getByRole('button', { name: 'Check In All Boats' }).click();
  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('button', { name: 'Previous' })).toBeEnabled();
});

test('check that the state is remembered when returning to the check in/out screen', async ({ page }) => {

  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
 
  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.getByRole('radio', { name: 'Check Out' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Check In' })).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
});

test('check that the state is remembered when returning to the boat selection screen', async ({ page }) => {
  await adminLogon(page);
  await page.goto('http://localhost:3000/admin');
  await page.getByRole('button', { name: 'Check In All Boats' }).click();
  await page.goto('http://localhost:4200/');
  await page.getByRole('radio', { name: 'Check Out' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await logInToAppIfNeeded(page);    
  await page.getByRole('option', { name: 'Spare Rib' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Previous' })).toBeEnabled();
  await expect(page.getByRole('option', { name: 'Spare Rib' })).toBeChecked
});


