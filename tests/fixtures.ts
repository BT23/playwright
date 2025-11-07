import path from 'path';
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login/loginPage';
import { WoPage } from '../pages/workorders/woPage';
import { PoPage } from '../pages/purchaseorder/poPage';

// WO Data
import createWorkOrderData from '../test-data/work-orders/createWorkOrderData.json';
import woDetailsTabData from '../test-data/work-orders/woDetailsTabData.json';
import addWOSpareData from '../test-data/work-orders/woSparesTabData.json';

//PO Data
import createPurchaseOrderData from '../test-data/purchase-orders/createPurchaseOrderData.json';

type MyFixtures = {
    loginPage: LoginPage;
    woPage: WoPage;
    poPage: PoPage;
    poTestData: typeof createPurchaseOrderData;
    woTestData: {
        createwo: typeof createWorkOrderData;
        details: typeof woDetailsTabData;
        spares: typeof addWOSpareData;
    };
    poDataFilePath: string;
    woDataFilePath: string;
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

    woPage: async ({ page, loginPage }, use) => {
        console.log('📦 Opening WO Module...');
        const woPage = new WoPage(page);
        await woPage.openWOModule();
        await use(woPage);
    },

    poPage: async ({ page, loginPage }, use) => {
        console.log('📦 Opening PO Module...');
        const poPage = new PoPage(page);
        await poPage.openPOModule();
        await use(poPage);
    },

    woTestData: async ({}, use) => {
        const combinedData = {
            createwo: createWorkOrderData,
            details: woDetailsTabData,
            spares: addWOSpareData,
        };
        await use(combinedData);
    },

    poTestData: async ({}, use) => {
        await use(createPurchaseOrderData);
    },

    woDataFilePath: async ({}, use) => {
        const filePath = path.resolve(__dirname, '../test-data/work-orders/woTempData.json');
        await use(filePath);
    },

    poDataFilePath: async ({}, use) => {
        const filePath = path.resolve(__dirname, '../test-data/purchase-orders/poTempData.json');
        await use(filePath);
    }

});
