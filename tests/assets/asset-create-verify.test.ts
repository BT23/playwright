import { test } from '../fixtures';

    /*
    * Test Case: Create New Parent Asset successfully
    * Preconditions: User is logged in and createWorkOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open Assets Module
    * 2. Click 'New Level 1' button
    * 3. Enter Description and Asset
    * 4. Click Create button
    * 5. Click Save and Back button
    * 6. Verify new Level 1 asset appears in the Asset Register tree
    * Expected Result: Level 1 created successfully and appears in the Asset Register
    * Returns: N/A
    * Custom tags: @smoke @feature-asset
    */ 

test('Create new level 1 asset using fixture data @smoke @feature-asset', async ({ assetPage, assetTestData }) => {
    console.log('🧪 Starting test: Create new level 1 asset using fixture data');
    await assetPage.createLevel1Asset(assetTestData.createasset.assetNumber, assetTestData.createasset.assetDesc);
    await assetPage.clickBackBtn(); // Save and Back
    console.log('🧪 Starting test: Verify New Level 1 asset showing on the tree using fixture data');
    await assetPage.verifyTreeNodePresentByName(assetTestData.createasset.assetNumber); 
});

