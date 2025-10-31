import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { SupplierPage } from '../../pages/Contacts/SupplierPage';

import createSupplierData from '../../test-data/contacts/suppliers/createsupplierData.json';

test.describe('Supplier Module Tests', () => {
    let loginPage: LoginPage;
    let supplierPage: SupplierPage;
    
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        supplierPage = new SupplierPage(page);
        
        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);       
    });

    /*
    * Bug 1234: Asset Warranty not shows after enering Asset Wararnty Reading
    * Source: https://jira.com/browse/BUG-1234
    * Steps:
    * 1. Open MEX Settings
    * 2. Click Contacts button
    * 3. Click Supplier tab
    * Expected Result: Supplier Listing should open
    * Custom tags: @bug @regression
    */    
    
    test('Open Supplier Listing @bug @regression', async () => {
        await supplierPage.openSupplierListing();
    });

    test('Create Supplier @bug @regression', async () => {
        await supplierPage.openSupplierListing();
        await supplierPage.createSupplier(createSupplierData.CompanyCode, createSupplierData.CompanyName);
    });

    test.only('Verify Supplier @bug @regression', async () => {
        await supplierPage.openSupplierListing();
        await supplierPage.createSupplier(createSupplierData.CompanyCode, createSupplierData.CompanyName);
        await supplierPage.verifySupplierExist();
    });
});
