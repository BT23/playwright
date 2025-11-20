import { test } from '../fixtures'

   /*
    * Test Case: Verify new asset shows on tree
    * This test verifies that a newly created asset appears in the asset tree. The asset created using createAssetData.json is used for verification.
    * Preconditions: User is logged in and createWorkOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open Asset Register
    * 2. Check the new asset with a specific name (createdAssetData.json) appears in the tree
    * Expected Result: New asset created successfully and appears in the asset tree
    * Custom tags: @smoke @feature-asset
    */
    test('Verify New Level 1 asset showing on the tree using fixture data @smoke @feature-asset', async ({ assetPage, assetTestData }) => {
        const assetNumber = assetTestData.createasset.assetNumber;
        const isPresent = await assetPage.isTreeNodePresent(assetNumber);
        
        if (!isPresent) {
        throw new Error(`Asset ${assetNumber} should be present in the tree`);
        }
});