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
    * 7. Delete the created Level 1 asset
    * 8. Verify the Level 1 asset is removed from the Asset Register tree
    * Expected Result: Level 1 deleted  successfully and does not appear in the Asset Register
    * Returns: N/A
    * Custom tags: @smoke @feature-asset
    */ 

test('Delete new level 1 asset using fixture data @smoke @feature-asset', async ({ assetPage, assetTestData }) => {
    console.log('🧪 Starting test: Create new level 1 asset using fixture data');
    await assetPage.goto();
    await assetPage.createLevel1Asset(assetTestData.deleteasset.assetNumber, assetTestData.deleteasset.assetDesc);
    // Click Save and Back button to return to Asset Register tree
    await assetPage.clickBackBtn();
    // Select the created asset again to verify asset is created and details saved
    await assetPage.selectTreeNodeByName(assetTestData.deleteasset.assetNumber);
    await assetPage.clickDeleteBtn();
    await assetPage.confirmDeleteAction("DeleteConfirmation", "Yes");
    console.log('🧪 Starting test: Verify New Level 1 asset showing on the tree using fixture data');
    await assetPage.verifyTreeNodeNotPresentByName(assetTestData.deleteasset.assetNumber);
});

