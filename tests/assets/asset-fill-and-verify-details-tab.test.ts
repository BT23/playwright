import { test } from '../fixtures'

    /*
    * Test Case: Fill in Asset Details - Details Tab
    * Preconditions: User is logged in and assetDetailsDetailsTabData.json is available. Fixture data used.
    * Steps:
    * 1. Open Assets Module
    * 2. Locate and select a specified asset on the tree (Specified asset number in assetDetailsDetailsTabData.json)
    * 3. Fill in all fields in the Details tab
    * 4. Save the changes
    * Expected Result: All fields in the Details tab are filled in successfully
    * Returns: N/A
    * Custom tags: @smoke @feature-asset
    */ 

test('Fill in Asset Details Details tab using fixture data @smoke @feature-asset', async ({ assetPage, assetTestData }) => { 
    console.log('🧪 Starting test: Fill in an existing asset details - details tab using fixture data');
    await assetPage.createLevel1Asset(assetTestData.assetdetailstab.assetNumber, assetTestData.assetdetailstab.assetDesc);
    await assetPage.assetDetails_DetailsTab_FillAllFields(assetTestData.assetdetailstab);
    await assetPage.addWarrantyAndReadingType();
    await assetPage.clickBackBtn();
    // Select the created asset again to verify asset is created and details saved
    await assetPage.selectTreeNodeByName(assetTestData.assetdetailstab.assetNumber);
    await assetPage.clickDetailsBtn();
    console.log('🧪 Starting test: Verify Asset Details Details Tab Information Populate');
    await assetPage.verifyAssetRegisterDetailsTabInfo(assetTestData.assetdetailstab);
    await assetPage.clickBackBtn();
});