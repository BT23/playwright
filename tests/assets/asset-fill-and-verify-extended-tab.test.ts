import { test } from '../fixtures'

    /*
    * Test Case: Fill in Asset Details - Extended Tab
    * Preconditions: User is logged in and assetDetailsExtendedTabData.json is available. Fixture data used.
    * Steps:
    * 1. Open Assets Module
    * 2. Create a new Asset
    * 4. Fill all fields in the Extended tab
    * 5. Save the changes
    * 6. Reopen the asset and navigate to the Extended tab
    * 7. Verify that all fields are populated with the correct data
    * Expected Result: All fields in the Extended tab are filled in successfully
    * Returns: N/A
    * Custom tags: @smoke @feature-asset
    */ 

test('Fill in Asset Details Extended tab using fixture data @smoke @feature-asset', async ({ assetPage, assetTestData }) => { 
    console.log('🧪 Starting test: fill in asset details - extended tab using fixture data');
    await assetPage.createLevel1Asset(assetTestData.assetextendedtab.assetNumber, assetTestData.assetextendedtab.assetDesc);
    await assetPage.assetDetails_ExtendedTab_FillAllFields(assetTestData.assetextendedtab);
    await assetPage.clickBackBtn();
    await assetPage.selectTreeNodeByName(assetTestData.assetextendedtab.assetNumber);
    await assetPage.clickDetailsBtn();
    console.log('🧪 Starting test: Verify Asset Details Details Tab Extended Information Populate');
    await assetPage.verifyAssetRegisterDetailsTabExtendedInfo(assetTestData.assetextendedtab);
    await assetPage.clickBackBtn();
});

