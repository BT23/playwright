import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { WoPage } from '../../pages/workorders/woPage';

import createWorkOrderData from '../../test-data/work-orders/createWorkOrderData.json';

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

    
});