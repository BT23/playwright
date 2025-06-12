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

    test('Open WO Module', async () => {
        await woPage.openWOModule();
    });

    test('Create New WO', async () => {
        await woPage.createNewWO();
    });

    test('Add WO Spare', async () => {
        await woPage.addWOSpare();
    });    
});
