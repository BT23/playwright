import path from 'path';
import { writeFileSync, readFileSync } from 'fs';
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login/loginPage';
import { PoPage } from '../pages/purchaseorder/poPage';
import createPurchaseOrderData from '../test-data/purchase-orders/createPurchaseOrderData.json';

type MyFixtures = {
    loginPage: LoginPage;
    poPage: PoPage;
    testData: typeof createPurchaseOrderData;
    poDataFilePath: string;
};

export const test = baseTest.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        console.log('🔐 Logging in...');
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(
            loginPage.credentials.validCredentials.username,
            loginPage.credentials.validCredentials.password
        );
        await use(loginPage);
    },

    poPage: async ({ page, loginPage }, use) => {
        console.log('📦 Opening PO Module...');
        const poPage = new PoPage(page);
        await poPage.openPOModule();
        await use(poPage);
    },

    testData: async ({}, use) => {
        await use(createPurchaseOrderData);
    },
    poDataFilePath: async ({}, use) => {
        const filePath = path.resolve(__dirname, '../test-data/purchase-orders/poTempData.json');
        await use(filePath);
    }
   
});