import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { WoPage } from '../pages/woPage';

import createWorkOrderData from '../test-data/work-orders/createWorkOrderData.json';

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
    /*
    * Reference ID: Test Case: Work Order Module should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Work Orders
    * 2. Verfiy that the Work Order Listing header is displayed
    * Expected Result: Work Order Listing loads without errors
    * Custom tags: @smoke
    */
    test.only('Open WO Module @smoke', async () => {
        await woPage.openWOModule();
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
    test.only('Create New WO @smoke', async () => {

        await woPage.createWorkOrder({
            assetNumber: createWorkOrderData.Asset,
            workorderDesc: createWorkOrderData.Description
        });
    });

    /*
    * Test Case: Add Work Order Spare successfully
    * This test 
    * Preconditions: User is logged in and .json is available
    * Steps:
    * 1. Open Work Orders
    * 2. Select a Work Order
    * 3. Click Spares tab
    * 3. Add a Spare by entering Catalogue item
    * 4. Save the Spare
    * Expected Result: New spare is added to work order successfully
    * Custom tags: @smoke
    */    
    test('Add WO Spare @regression', async () => {
        await woPage.addWOSpare();
    });    
});
