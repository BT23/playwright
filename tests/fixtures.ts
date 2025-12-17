import path from 'path';
import fs from 'fs';
import { test as baseTest } from '@playwright/test';
import { expect } from '@playwright/test';

import { LoginPage } from '../pages/login/loginPage';
import { AssetPage } from '../pages/assets/assetPage';
import { WoPage } from '../pages/workorders/woPage';
import { PoPage } from '../pages/purchaseorder/poPage';
import { CataloguePage } from '../pages/catalogue/cataloguePage';

import createAssetData from '../test-data/assets/createAssetData.json';
import assetDetailsTabData from '../test-data/assets/assetDetailsDetailsTabData.json';
import assetExtendedTabData from '../test-data/assets/assetDetailsExtendedTabData.json';
import createWorkOrderData from '../test-data/work-orders/createWorkOrderData.json';
import woDetailsTabData from '../test-data/work-orders/woDetailsTabData.json';
import addWOSpareData from '../test-data/work-orders/woSparesTabData.json';
import createCatalogueData from '../test-data/catalogue/createCatalogueData.json';
import createPurchaseOrderData from '../test-data/purchase-orders/createPurchaseOrderData.json';

type MyFixtures = {
  loginPage: LoginPage;
  assetPage: AssetPage;
  woPage: WoPage;
  cataloguePage: CataloguePage;
  poPage: PoPage;
  poTestData: { createpo: typeof createPurchaseOrderData };
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
  catalogueTestData: {
    createcatalogue: typeof createCatalogueData;
  };  
  assetDataFilePath: string;
  poDataFilePath: string;
  catalogueFilePath: string;
  woDataFilePath: string;
};

export const test = baseTest.extend<MyFixtures>({  
  
 // page: async ({ page }, use) => {
 //   const loginPage = new LoginPage(page);

    /*
     Due to the login page loads twice, the following login steps have to run twice.
     Once the recaptcha issue is resolved, the baseURL + storageState code can be removed.
     */
    //await loginPage.assertLoginSuccess();
    //await page.goto('/Home?baseRoute=true'); // baseURL + storageState handles auth
  //  await page.goto('https://staging-automation-test.mex16.dev/');

    // Optional small delay for stability
    //await page.waitForTimeout(500);    
    
    //await page.goto('/Home?baseRoute=true'); // baseURL + storageState handles auth
  //  await loginPage.assertLoginSuccess();

    // ✅ Wait for the Home header to confirm successful login
  //  const homeHeader = page.locator('[automation-header="HomeHeader"]');
  //  await expect(homeHeader).toBeVisible({ timeout: 10000 }); // Wait up to 10s

    // Optional small delay for stability
  //  await page.waitForTimeout(500);


  //  await use(page);
  //},
  
  // Keep the loginPage fixture for other pages to use
  loginPage: async ({ page }, use) => {
    console.log('🔐 Navigating to login page...');
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    // ✅ Perform login (UI interaction still happens)
    await loginPage.login(
      loginPage.credentials.validCredentials.username,
      loginPage.credentials.validCredentials.password
    );

    await use(loginPage);
  },


  assetPage: async ({ page, loginPage}, use) => {
    const assetPage = new AssetPage(page);
    await assetPage.openAssetModule();
    await use(assetPage);
  },

  woPage: async ({ page, loginPage }, use) => {
    const woPage = new WoPage(page);
    await woPage.openWOModule();
    await use(woPage);
  },

  cataloguePage: async ({ page, loginPage }, use) => {
    const cataloguePage = new CataloguePage(page);
    await cataloguePage.openCatalogueModule();
    await use(cataloguePage);
  },

  poPage: async ({ page, loginPage }, use) => {
    const poPage = new PoPage(page);
    await poPage.openPOModule();
    await use(poPage);
  },

  assetTestData: async ({}, use) => {
    await use({
      createasset: createAssetData,
      assetdetailstab: assetDetailsTabData,
      assetextendedtab: assetExtendedTabData,
    });
  },

  woTestData: async ({}, use) => {
    await use({
      createwo: createWorkOrderData,
      wodetails: woDetailsTabData,
      wospares: addWOSpareData,
    });
  },

  poTestData: async ({}, use) => {
    await use({ createpo: createPurchaseOrderData });
  },

  assetDataFilePath: async ({}, use) => {
    await use(path.resolve(__dirname, '../test-data/assets/assetTempData.json'));
  },

  woDataFilePath: async ({}, use) => {
    await use(path.resolve(__dirname, '../test-data/work-orders/woTempData.json'));
  },

  poDataFilePath: async ({}, use) => {
    await use(path.resolve(__dirname, '../test-data/purchase-orders/poTempData.json'));
  },
});
