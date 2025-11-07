import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { AssetPage } from '../../pages/assets/assetPage';
import {ReadingPage} from '../../pages/readings/readingPage';
import { WoPage } from '../../pages/workorders/woPage';

import createAssetData from '../../test-data/assets/createAssetData.json';
import assetDetailsDetailsTabData from '../../test-data/assets/assetDetailsDetailsTabData.json';
import assetDetailsExtendedTabData from '../../test-data/assets/assetDetailsExtendedTabData.json';

test.describe('Asset Module Tests', () => {
    let loginPage: LoginPage;
    let assetPage: AssetPage;
    let readingPage: ReadingPage;
    let woPage: WoPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        assetPage = new AssetPage(page);
        readingPage = new ReadingPage(page);
        woPage = new WoPage(page);

        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
    });

    /*
    * Reference ID: Test Case: Asset Module should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Register
    * 2. Verfiy that the Asset Register header is displayed
    * Expected Result: Asset Register loads without errors
    * Custom tags: @smoke
    */
    test('Open Asset Module @smoke', async () => {
        await assetPage.openAssetModule();
    });

    /*
    * Test Case: Asset Details should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Register
    * 2. Open any asset details by right-clicking on the asset
    * Expected Result: Asset Details loads without errors
    * Custom tags: @smoke
    */
    test('Open Asset Details @smoke', async () => {
        await assetPage.openAssetDetailsByRightClick();
    });

   /*
    * Test Case: Verify new asset shows on tree
    * This test verifies that a newly created asset appears in the asset tree
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Register
    * 2. Check thennew asset with a specific name (e.g., "Sports") appears in the tree
    * Expected Result: New asset created successfully and appears in the asset register
    * Custom tags: @smoke
    */
    test('Verify New Asset Show On Tree @smoke', async () => {
        const isPresent = await assetPage.isTreeNodePresent("Toys");
        expect(isPresent).toBeTruthy();
    });

   /*
    * Test Case: Fill in Asset Details - Details Tab
    * This test fills in the details tab of the asset details form
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Register
    * 2. Open the asset details of an existing asset
    * 3. Fill in all fields in the Details tab
    * 4. Save the changes
    * Expected Result: All fields in the Details tab are filled in successfully
    * The asset details are saved without errors
    * Custom tags: @regression
    */      
    test('Fill Asset Details Details Tab @regression', async () => {
        await assetPage.assetDetails_DetailsTab_FillAllFields(assetDetailsDetailsTabData.assetNumber);
    });

   /*
    * Test Case: Fill in Asset Details - Extended Tab
    * This test fills in the details tab of the asset details form
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Register
    * 2. Locate the asset created in the previous test
    * 3. Open the asset details of an existing asset
    * 4. Open the Extended tab
    * 5. Fill in all fields in the Extended tab
    * 6. Save the changes
    * Expected Result: All fields in the Extended tab are filled in successfully
    * The asset extended tab values are saved without errors
    * Custom tags: @regression
    */      
    test('Fill Asset Details Extended Tab @regression', async () => {
        await assetPage.assetDetails_ExtendedTab_FillAllFields(assetDetailsExtendedTabData.assetNumber);
    });
    
    /*
    * Test Case: Expand tree node by name
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Register
    * 2. Expand the tree node by clicking the expander icon next to the node name
    * Expected Result: Tree node expands without errors
    * Custom tags: @smoke
    */
    test('LocateTreeNode @regression', async () => {
        await assetPage.locateTreeNodeByName("Admin");
    });

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
    test('Verify Asset Details Details Tab Information Populate @regression', async () => {
        await assetPage.verifyAssetRegisterDetailsTabInfo(assetDetailsDetailsTabData.assetNumber);
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
    test('Verify Asset Details Details Tab Extended Information Populate @regression', async () => {
        await assetPage.verifyAssetRegisterDetailsTabExtendedInfo(assetDetailsExtendedTabData.assetNumber);
    });

});