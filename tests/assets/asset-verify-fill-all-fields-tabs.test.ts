import { test } from '../fixtures'

    /*
    ***********************
    **  VERIFICATION TESTS
    ***********************
     */

   /*
    * Test Case: Verify entered values populate in the Asset Register Details tab
    * Preconditions: 
    * - User is logged in
    * - Asset Details - Details Tab has been filled in
    * Steps:
    * 1. Open Asset Register
    * 2. Locate the asset created in the previous test
    * Expected Result: Some values entered in the Details tab should be visible in the Asset Register Details tab
    * Custom tags: @regression
    */
    test.only('Verify Asset Details Details Tab Information Populate @regression', async ({ assetPage, assetTestData }) => {
        await assetPage.selectTreeNodeByName(assetTestData.assetdetailstab.assetNumber);
        await assetPage.clickDetailsBtn();
        await assetPage.verifyAssetRegisterDetailsTabInfo(assetTestData.assetdetailstab);
        await assetPage.clickBackBtn();
    });

    /*
    * Test Case: Verify entered values populate in the Asset Register Details tab - EXTENDED Information
    * This test verifies that the values entered in the Extended tab of the asset details are visible in the Asset Register Details tab
    * Preconditions: 
    * - User is logged in
    * - Asset Details - Extended Tab has been filled in
    * Steps:
    * 1. Open Asset Register
    * 2. Locate the asset created in the previous test
    * Expected Result: Some values entered in the Details tab should be visible in the Asset Register Details tab
    * Custom tags: @regression
    */
    test('Verify Asset Details Details Tab Extended Information Populate @regression', async ({ assetPage, assetTestData }) => {
        await assetPage.selectTreeNodeByName(assetTestData.assetextendedtab.assetNumber);
        await assetPage.clickDetailsBtn();
        await assetPage.verifyAssetRegisterDetailsTabExtendedInfo(assetTestData.assetextendedtab);
        await assetPage.clickBackBtn();
    });