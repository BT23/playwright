import { test } from '../fixtures'

    /*
    * Test Case: Create New Parent Asset successfully
    * Preconditions: User is logged in and createWorkOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open Assets Module
    * 2. Click 'New Level 1' button
    * 3. Enter Description and Asset
    * 4. Click Create button
    * Expected Result: Level 1 created successfully and appears in the Asset Register
    * Returns: N/A
    * Custom tags: @smoke @feature-asset
    */ 

test('Create new level 1 asset using fixture data @smoke @feature-asset', async ({ assetPage, assetTestData }) => {
    await assetPage.createLevel1Asset(assetTestData.createasset.assetNumber, assetTestData.createasset.assetDesc);
    await assetPage.clickBackBtn(); // Save and Back

    /*
    * Test Case: Create New Parent Asset successfully
    * Preconditions: User is logged in and createWorkOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open Assets Module
    * 2. Click 'New Child' button
    * 3. Enter Description and Asset
    * 4. Click Create button
    * Expected Result: New Child asset created successfully under the correct parent and appears in the Asset Register
    * Returns: N/A
    * Custom tags: @smoke @feature-asset
    */  

});

