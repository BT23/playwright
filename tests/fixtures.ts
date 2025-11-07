import path from 'path';
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login/loginPage';
import {AssetPage} from '../pages/assets/assetPage';
import { WoPage } from '../pages/workorders/woPage';
import { PoPage } from '../pages/purchaseorder/poPage';

// Asset Data
import createAssetData from '../test-data/assets/createAssetData.json';
import assetDetailsTabData from '../test-data/assets/assetDetailsDetailsTabData.json';
import assetExtendedTabData from '../test-data/assets/assetDetailsExtendedTabData.json';

// WO Data
import createWorkOrderData from '../test-data/work-orders/createWorkOrderData.json';
import woDetailsTabData from '../test-data/work-orders/woDetailsTabData.json';
import addWOSpareData from '../test-data/work-orders/woSparesTabData.json';

//PO Data
import createPurchaseOrderData from '../test-data/purchase-orders/createPurchaseOrderData.json';
import { create } from 'domain';

type MyFixtures = {
    loginPage: LoginPage;
    assetPage: AssetPage;
    woPage: WoPage;
    poPage: PoPage;
    poTestData: {
        createpo: typeof createPurchaseOrderData;
    }
    assetTestData: {
        createasset: typeof createAssetData;
        assetdetailstab: typeof assetDetailsTabData;
        assetextendedtab: typeof assetExtendedTabData;
    };
    woTestData: {
        createwo: typeof createWorkOrderData;
        wodetails: typeof woDetailsTabData;
        wospares: typeof addWOSpareData;
    };
    assetDataFilePath: string;
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

    // loginPage is required for these pages to ensure user is logged in before accessing them
    assetPage: async ({ page, loginPage }, use) => {
        console.log('📦 Opening Asset Register...');
        const assetPage = new AssetPage(page);
        await assetPage.openAssetModule();
        await use(assetPage);
    },

    woPage: async ({ page, loginPage }, use) => {
        console.log('📦 Opening WO Module...');
        const woPage = new WoPage(page);
        await woPage.openWOModule();
        await use(woPage);
    },

    poPage: async ({ page, loginPage}, use) => {
        console.log('📦 Opening PO Module...');
        const poPage = new PoPage(page);
        await poPage.openPOModule();
        await use(poPage);
    },

    assetTestData: async ({}, use) => {
        const assetCombinedData = {
            createasset: createAssetData,
            assetdetailstab: assetDetailsTabData,
            assetextendedtab: assetExtendedTabData,
        };
        await use(assetCombinedData);
    },

    woTestData: async ({}, use) => {
        const woCombinedData = {
            createwo: createWorkOrderData,
            wodetails: woDetailsTabData,
            wospares: addWOSpareData,
        };
        await use(woCombinedData);
    },

    poTestData: async ({}, use) => {
        const poCombinedData = {
            createpo: createPurchaseOrderData,
        };
        await use(poCombinedData);
    },

    assetDataFilePath: async ({}, use) => {
        const filePath = path.resolve(__dirname, '../test-data/assets/assetTempData.json');
        await use(filePath);
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
