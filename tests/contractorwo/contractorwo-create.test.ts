     import { test } from '../fixtures';
     /*
    * Test Case: Create New Contractor WO Successfully
    * Preconditions: User is logged in and createContractorWOData.json is available. Fixture data used.
    * Steps:
    * 1. Open WO Listing
    * 2. Click 'Contractor' button
    * 3. Click 'New' button
    * 4. Enter Description, Asset, and Contractor
    * 5. Click Create button
    * Expected Result: A new Contractor Work Order is created and appears in the Contractor Work Order Listing.
    * Custom tags: @smoke @regression @feature-contractorWO
    */  

    test('Create New Contractor WO @smoke @regression @feature-contractorwo', async ({ contractorWOPage, contractorWOTestData }) => {
        console.log("📝 Starting test: Create a new Contractor Work Order on Contractor WO Listing");
        await contractorWOPage.goto();        
        await contractorWOPage.createContractorWO(contractorWOTestData.createcontractorwo.Description, contractorWOTestData.createcontractorwo.Asset, contractorWOTestData.createcontractorwo.Contractor);
        await contractorWOPage.clickBackBtn();
    });   