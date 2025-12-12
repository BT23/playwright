import { test } from '../fixtures'

    /*
    * Test Case: Create New Parent Asset successfully
    * Preconditions: User is logged in and assetDetailsExtendedTabData.json is available. Fixture data used.
    * Steps:
    * 1. Open Assets Module
    * 2. Locate and select a specified asset on the tree (Specified asset number in assetDetailsExtendedTabData.json)
    * 3. Click Details button
    * 4. Fill all fields in the Extended tab
    * 5. Save the changes
    * Expected Result: All fields in the Extended tab are filled in successfully
    * Returns: N/A
    * Custom tags: @smoke @feature-asset
    */ 

test('Fill in Asset Details Extended tab using fixture data @smoke @feature-asset', async ({ assetPage, assetTestData }) => { 
    console.log('🧪 Starting test: fill in asset details - extended tab using fixture data');
    await assetPage.selectTreeNodeByName(assetTestData.assetextendedtab.assetNumber);
    await assetPage.clickDetailsBtn();
    await assetPage.assetDetails_ExtendedTab_FillAllFields(assetTestData.assetextendedtab);
    await assetPage.clickBackBtn();
});

