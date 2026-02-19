import { test } from '../fixtures'

    /*
    * Test Case: Create New WO successfully
    * Preconditions: User is logged in and createWorkOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open WO Module
    * 2. Click New button
    * 3. Enter Description and Asset
    * 4. Click Create button
    * Expected Result: WO created successfully and appears in the WO Listing
    * Returns: WO Number and saves to woTempData.json
    * Custom tags: @smoke @feature-wo
    */ 

test('Create WO using fixture data @smoke @feature-wo', async ({ woPage, woTestData, woDataFilePath  }) => {
    console.log('🧪 Starting test: Create new WO using fixture data');
    await woPage.goto(); // Open WO Module
    await woPage.createWO(woTestData.createwo.Asset, woTestData.createwo.Description, woDataFilePath);
    await woPage.clickBackBtn(); // Save and Back

});