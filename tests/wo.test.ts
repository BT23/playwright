import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WoPage } from '../pages/woPage';

test.describe('WO Module Tests', () => {
    let loginPage: LoginPage;
    let woPage: WoPage;
    
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        woPage = new WoPage(page);
        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
        await loginPage.assertLoginSuccess();
    });

    test.only('Open WO Module', async ({ page }) => {
        // Wait for the "Work Orders" image to be visible
        await page.waitForSelector('img[src="/_content/Mex.Blazor/images/WorkOrders.png"]', { state: 'visible' });

        await woPage.openWOModule();
    });


    test('Create New WO', async ({ page }) => {
        await page.waitForSelector('img[src="/_content/Mex.Blazor/images/WorkOrders.png"]', { state: 'visible' });
        await woPage.createNewWO();
    });
});
