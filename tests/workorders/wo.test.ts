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
    test('Create New WO @smoke', async () => {

        await woPage.createWorkOrder({
            assetNumber: createWorkOrderData.Asset,
            workorderDesc: createWorkOrderData.Description
        });
    });

   /*
    * Test Case: Fill in WO Details - Details Tab
    * This test fills in the details tab of the WO details form
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Work Orders
    * 2. Open the details of an existing WO
    * 3. Fill in all fields in the Details tab
    * 4. Save the changes
    * Expected Result: All fields in the Details tab are filled in successfully
    * The WO details are saved without errors
    * Custom tags: @regression
    * */  
    test('Fill WO Details Details Tab @regression', async () => {
        await woPage.workOrderDetails_DetailsTab_FillAllFields();
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


    test('verify WO Requester', async ({ page }) => {
        await woPage.openWOModule();
        await woPage.reopenWOFromListing();
        await woPage.verifyWORequester("Toby Tang");
    });  

    /*
    * Reference ID: Test Case: Open specified Closed WO
    * Preconditions: User is logged in
    * Steps:
    * 1. Open History Listing
    * 2. Select the specified closed WO
    * 3. Click 'Details' button
    * Expected Result: Specified closed WO should open successfully.
    * Custom tags: @smoke
    */
    test('Open Specified Opened WO @smoke', async () => {
        await woPage.openWOModule()
        await woPage.openClosedWOByWONumber("108");
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
