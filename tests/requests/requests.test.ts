import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { RequestPage } from '../../pages/requests/requestPage';
import { AssetPage } from '../../pages/assets/assetPage';
import { helper } from '../../helperMethods';

import testData from '../../test-data/e2e/requestWOData.json';
import requestData from '../../test-data/requests/createRequestData.json';

test.describe('Requests Module Tests', () => {
    let loginPage: LoginPage;
    let requestPage: RequestPage;
    let assetPage: AssetPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        requestPage = new RequestPage(page);
        assetPage = new AssetPage(page);

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
    test('Open Requests Module @smoke', async () => {
        await requestPage.openRequestsModule();
    });

    test.only('Create New Request with Asset @smoke', async () => {
        await requestPage.openRequestsModule();
        await requestPage.createRequest(requestData.jobDesc, requestData.assetNumber, true);
    });

    test('Create New Request No Asset @smoke', async () => {
        await requestPage.openRequestsModule();
        await requestPage.createRequest(requestData.jobDesc, requestData.assetNumber);
    });

});