import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { WoPage } from '../../pages/workorders/woPage';
import { ContractorPortalPage } from '../../pages/contractoruserportal/contractorportalPage';
import { ContractorWOPage } from '../../pages/contractorworkorders/contractorwoPage';
import { PoPage } from '../../pages/purchaseorder/poPage';

import newContractorWOData from '../../test-data/contractor-work-orders/createContractorWOData.json';
import filterData from '../../test-data/contractor-work-orders/contractorFilterData.json';

test.describe('Contractor WO Module Tests', () => {
    let loginPage: LoginPage;
    let woPage: WoPage;
    let contractorportalPage: ContractorPortalPage;    
    let contractorwoPage: ContractorWOPage;
    let poPage: PoPage;
    
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        woPage = new WoPage(page);
        contractorportalPage = new ContractorPortalPage(page);
        contractorwoPage = new ContractorWOPage(page);
        poPage = new PoPage(page);
        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
    });

     /*
    * Reference ID: Test Case: Contractor Work Order Listing should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Work Orders
    * 2. Verfiy that the Work Order Listing header is displayed
    * 3. Click 'Contractor' button
    * Expected Result: Contractor  Work Order Listing loads without errors
    * Custom tags: @smoke @contractorWO 
    */
    test('Open Contractor WO Listing @smoke', async () => {
        await contractorwoPage.openContractorWOListing();
    });

     /*
    * Bug 1234: New Contractor Work Order should create successfully
    * Source: https://jira.com/browse/BUG-1234
    * Steps:
    * 1. Open WO Listing
    * 2. Click 'Contractor' button
    * 3. Click 'New' button
    * 4. Enter Description, Asset, and Contractor
    * 5. Click Create button
    * Expected Result: A new Contractor Work Order is created and appears in the Contractor Work Order Listing.
    * Custom tags: @smoke
    */    
    test('Create New Contractor WO @smoke', async () => {
        await contractorwoPage.createContractorWO(newContractorWOData.Description, newContractorWOData.Asset, newContractorWOData.Contractor);
    });   

    /*
    * Bug 1234: Contractor Listing cannot filter by contractor
    * Source: https://jira.com/browse/BUG-1234
    * Steps:
    * 1. Open WO Listing
    * 2. Click 'Contractor' button
    * 3. Click 'Filter' button
    * 4. Enter Contractor
    * 5. Click Apply button
    * Expected Result: The Contractor Listing should display only those records that exactly match the selected or specified contractor criteria.
    * Custom tags: @bug @regression @contractorWO 
    */    
    test('Contractor Listing Filter by Contractor @bug @regression @contractorWO', async () => {
        await contractorwoPage.openContractorWOListing();
        await contractorwoPage.openContractorListingFilter();
        await contractorwoPage.applyContractorFilter(filterData.Contractor);
        await contractorwoPage.verifyContractorFilterApplied(filterData.Contractor);
    });


    /*
    * FOR TEST CASE TESTING
    */
    test('Fill in Due Start Date and verify in PO @bug @regression @contractorWO', async () => {
        await contractorwoPage.createContractorWO("Due Start Date Test", "House", "Bakers EA Baker and Co");
        const dueStart: string = await contractorwoPage.setContractorDueStartDate();
        //await contractorwoPage.setContractorDueStartDate();
        await contractorwoPage.clickAddPOBtn();
        await contractorwoPage.clickPOHyperlink();
        //const dueStart: string = await contractorwoPage.setContractorDueStartDate();
        await poPage.verifyPODueStartDate(dueStart);
    });
});