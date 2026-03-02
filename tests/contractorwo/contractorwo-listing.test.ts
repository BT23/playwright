import { test } from '../fixtures';
     /*
    * Reference ID: Test Case: Contractor Work Order Listing should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Work Orders
    * 2. Verfiy that the Work Order Listing header is displayed
    * 3. Click 'Contractor' button
    * Expected Result: Contractor  Work Order Listing loads without errors
    * Custom tags: @smoke @feature-contractorWO 
    */
 
     test('Open Contractor WO Listing @smoke @feature-contractorwo', async ({ contractorWOPage }) => {
        console.log("📝 Starting test: Open Contractor Work Order Listing");
        await contractorWOPage.openContractorWOListing();
    });