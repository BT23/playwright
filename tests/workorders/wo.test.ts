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




    test('verify WO Requester', async ({ page }) => {
        await woPage.openWOModule();
        await woPage.reopenWOFromListing();
        await woPage.verifyWORequester("Toby Tang");
    });  

  

    /*
    * Reference ID: Test Case: Print specified WO
    * Preconditions: User is logged in
    * Steps:
    * 1. Open History Listing
    * 2. Select the specified closed WO
    * 3. Click 'Details' button
    * Expected Result: WO report with Specified WO Number should print successfully.
    * Custom tags: @smoke
    */
    test.only('Print Specified Opened WO @smoke', async () => {
        await woPage.openWOModule()
        await woPage.printWOPrint("108");
    }); 

    /*
    * Reference ID: Test Case: Open the first WO on the listing
    * Preconditions: User is logged in
    * Steps:
    * 1. Open WO Listing
    * 2. Click Details button
    * Expected Result: The first WO on the list should open successfully.
    * Custom tags: @smoke
    */

    test('openFirstRecordOnListing', async ({ page }) => {
        await woPage.openWOModule();
        await woPage.reopenWOFromListing();
    });    

});
