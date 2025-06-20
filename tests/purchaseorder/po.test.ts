import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { PoPage } from '../../pages/purchaseorder/poPage';

import createPurhcaseOrderData from '../../test-data/purchase-orders/createPurchaseOrderData.json';

test.describe('PO Module Tests', () => {
    let loginPage: LoginPage;
    let poPage: PoPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        poPage = new PoPage(page);
        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
        await loginPage.assertLoginSuccess();
    });

    /*
    * Reference ID: Test Case: PO Listing should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Stores Menu
    * 2. Open Purchse Order Listing
    * Expected Result: Purchase Order Listing loads without errors
    * Custom tags: @smoke @PO
    */
    test('Open PO Listing @smoke @PO', async () => {
        await poPage.openPOModule();
    });

    /*
    * Test Case: Create New Work Order successfully
    * This test creates a new WO using the data from createWorkOrderData.json 
    * Preconditions: User is logged in and createWorkOrderData.json is available
    * Steps:
    * 1. Open Work Orders
    * 2. Click New button
    * 3. Enter Asset Number and WO Description
    * Expected Result: New WO created successfully and appears in the WO Listing
    * Custom tags: @smoke
    */    
    test('Create New PO @smoke', async () => {
        await poPage.createPurchaseOrder(createPurhcaseOrderData.Supplier);
    });

   
    test.only('Verify PO Transaction @smoke', async () => {
        await poPage.openPOModule();
        await poPage.clickPODetailsBtn();
        await poPage.clickPOTransactionsTab();
        await poPage.verifyPOContractorInvoiceTransactions();
    });
});