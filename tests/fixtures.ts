import path from 'path';
import fs from 'fs';
import { test as baseTest } from '@playwright/test';
import { expect } from '@playwright/test';

import { LoginPage } from '../pages/login/loginPage';
import { AssetPage } from '../pages/assets/assetPage';
import { RequestPage } from '../pages/requests/requestPage';
import { WoPage } from '../pages/workorders/woPage';
import { PoPage } from '../pages/purchaseorder/poPage';
import { CataloguePage } from '../pages/catalogue/cataloguePage';
import { SupplierPage } from '../pages/Contacts/SupplierPage';

import createAssetData from '../test-data/assets/createAssetData.json';
import deleteAssetData from '../test-data/assets/deleteAssetData.json';
import assetDetailsTabData from '../test-data/assets/assetDetailsDetailsTabData.json';
import assetExtendedTabData from '../test-data/assets/assetDetailsExtendedTabData.json';
import createRequestData from '../test-data/requests/createRequestData.json';
import createWorkOrderData from '../test-data/work-orders/createWorkOrderData.json';
import woDetailsTabData from '../test-data/work-orders/woDetailsTabData.json';
import addWOSpareData from '../test-data/work-orders/woSparesTabData.json';
import createCatalogueData from '../test-data/catalogue/createCatalogueData.json';
import createPurchaseOrderData from '../test-data/purchase-orders/createPurchaseOrderData.json';
import createSupplierData from '../test-data/contacts/suppliers/createSupplierData.json';

type MyFixtures = {
  loginPage: LoginPage;
  assetPage: AssetPage;
  requestPage: RequestPage;
  woPage: WoPage;
  cataloguePage: CataloguePage;
  poPage: PoPage;
  supplierPage: SupplierPage;
  poTestData: { createpo: typeof createPurchaseOrderData };
  assetTestData: {
    createasset: typeof createAssetData;
    deleteasset: typeof deleteAssetData;
    assetdetailstab: typeof assetDetailsTabData;
    assetextendedtab: typeof assetExtendedTabData;
  };
  requestTestData: { createrequest: typeof createRequestData };
  woTestData: {
    createwo: typeof createWorkOrderData;
    wodetails: typeof woDetailsTabData;
    wospares: typeof addWOSpareData;
  };
  catalogueTestData: {
    createcatalogue: typeof createCatalogueData;
  };
  supplierTestData: {createsupplier: typeof createSupplierData;};  
  assetDataFilePath: string;
  requestDataFilePath: string;
  catalogueFilePath: string;
  poDataFilePath: string;
  woDataFilePath: string;
  supplierDataFilePath: string;
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
    await use(new AssetPage(page));
  },

  requestPage: async ({ page, loginPage}, use) => {
    await use(new RequestPage(page));
  },

  woPage: async ({ page, loginPage }, use) => {
    await use(new WoPage(page));    
  },

  cataloguePage: async ({ page, loginPage }, use) => {
    await use(new CataloguePage(page));
  },

  poPage: async ({ page, loginPage }, use) => {
    await use(new PoPage(page));
  },

  supplierPage: async ({ page, loginPage }, use) => {
    await use(new SupplierPage(page));
  },

  assetTestData: async ({}, use) => {
    await use({
      createasset: createAssetData,
      deleteasset: deleteAssetData,
      assetdetailstab: assetDetailsTabData,
      assetextendedtab: assetExtendedTabData,
    });
  },

  requestTestData: async ({}, use) => {
    await use({
      createrequest: createRequestData
    });
  },

  woTestData: async ({}, use) => {
    await use({
      createwo: createWorkOrderData,
      wodetails: woDetailsTabData,
      wospares: addWOSpareData,
    });
  },

  catalogueTestData: async ({}, use) => {
    await use({
      createcatalogue: createCatalogueData
    });
  },

  poTestData: async ({}, use) => {
    await use({ createpo: createPurchaseOrderData });
  },

  supplierTestData: async ({}, use) => {
    await use({ createsupplier: createSupplierData });
  },
  
  assetDataFilePath: async ({}, use) => {
    await use(path.resolve(__dirname, '../test-data/assets/assetTempData.json'));
  },

  requestDataFilePath: async ({}, use) => {
    await use(path.resolve(__dirname, '../test-data/requests/requestTempData.json'));
  },

  woDataFilePath: async ({}, use) => {
    await use(path.resolve(__dirname, '../test-data/work-orders/woTempData.json'));
  },

  poDataFilePath: async ({}, use) => {
    await use(path.resolve(__dirname, '../test-data/purchase-orders/poTempData.json'));
  },
});
