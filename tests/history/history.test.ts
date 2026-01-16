import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { HistoryPage } from '../../pages/history/historyPage';

import createPostEntryWOrData from '../../test-data/history/createPostEntryWOData.json';

test.describe('WO History Module Tests', () => {
    let loginPage: LoginPage;
    let historyPage: HistoryPage;
    
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        historyPage = new HistoryPage(page);
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
    test('Open History Module @smoke', async () => {
        await historyPage.openHistoryModule();
    });

    /*
    * Reference ID: Test Case: Create Post Entry WO
    * Preconditions: User is logged in
    * Steps:
    * 1. Open History Listing
    * 2. Click 'Post Entry' button
    * 3. Enter History Description and Asset
    * 4. Click 'Create' button
    * Expected Result: Post Entry WO should create successfully.
    * Custom tags: @smoke
    */
    test('Create Post Entry WO @smoke', async () => {
        
        await historyPage.createPostEntryWO(createPostEntryWOrData.HistoryDesc, createPostEntryWOrData.Asset);
    });

    /*
    * Reference ID: Test Case: Open specified Closed WO
    * Preconditions: User is logged in
    * Steps:
    * 1. Open History Listing
    * 2. Select the specified closed WO
    * 3. Click 'Details' button
    * Expected Result: Specified closed WO should open successfully.
    * Custom tags: @smoke
    */
    test('Open Specified Closed WO @smoke', async () => {
        await historyPage.openHistoryModule();
        await historyPage.openClosedWOByWONumber("35");
    });

});