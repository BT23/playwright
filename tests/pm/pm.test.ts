import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { PmPage } from '../../pages/pm/pmPage';

test.describe('PM Module Tests', () => {
    let loginPage: LoginPage;
    let pmPage: PmPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        pmPage = new PmPage(page);

        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
        await loginPage.assertLoginSuccess();
    });

    /*
    * Reference ID: Test Case: PM Module should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Preventative Maintenance 
    * 2. Verfiy that the PM header is displayed
    * Expected Result: PM loads without errors
    * Custom tags: @smoke
    */
    test('Open PM Module @smoke', async () => {
        await pmPage.openPMModule();
    });

});