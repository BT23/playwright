import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import {ReadingPage} from '../../pages/readings/readingPage';

import createAssetData from '../../test-data/assets/createAssetData.json';

test.describe('Readings Module Tests', () => {
    let loginPage: LoginPage;
    let readingPage: ReadingPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        readingPage = new ReadingPage(page);

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
    test('Open Readings Module @smoke', async () => {
        await readingPage.openReadingsModule();
    });

    test('Select the Asset Reading and add reading @smoke', async () => {
        readingPage.openReadingsModule();
        await readingPage.locateAndAddAssetReading(createAssetData.assetNumber, "100");
    });    
});