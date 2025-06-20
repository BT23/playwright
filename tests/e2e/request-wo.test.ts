import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { AssetPage } from '../../pages/assets/assetPage';
import { RequestPage } from '../../pages/requests/requestPage';
import { WoPage } from '../../pages/workorders/woPage';

import testData from '../../test-data/e2e/requestWOData.json';


test.describe('Requests Work Orders Tests', () => {
    let loginPage: LoginPage;
    let assetPage: AssetPage;
    let requestPage: RequestPage;
    let woPage: WoPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        assetPage = new AssetPage(page);
        requestPage = new RequestPage(page);
        woPage = new WoPage(page);

        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
        await loginPage.assertLoginSuccess();
    });

    /*
    * Bug 1234: WO Requester does not populate when creating a WO from Request
    * Source: https://jira.com/browse/BUG-1234
    * Steps:
    * 1. Open Asset Register
    * 2. Create a new Asset
    * 3. Open Request Listing
    * 4. Create a new Request
    * 5. Add an asset
    * 6. Approve the Request
    * 7. Click 'Create WO'
    * Expected Result: WO Requester should autofill
    * Custom tags: @bug @regression @asset @WO
    */    
    test('Request Work Order Requester autofill - Case 1 @bug @regression @asset @WO', async () => {
        const data = testData.case1;
        await assetPage.createNewAsset(data.assetNumber, data.assetDesc, 2);
        await requestPage.createRequest(data.requestJobDesc);
        await requestPage.setRequestAsset(data.assetNumber);
        await requestPage.approveRequestAndClickOK();
        const requester = await requestPage.createRequestWorkOrder();
        await woPage.verifyWORequester(requester);
    });
});