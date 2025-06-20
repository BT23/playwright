import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { AssetPage } from '../../pages/assets/assetPage';
import {ReadingPage} from '../../pages/readings/readingPage';
import { WoPage } from '../../pages/workorders/woPage';

import testData from '../../test-data/e2e/assetReadingWOData.json';

test.describe('Asset Reading WorkOrder Tests', () => {
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
        await loginPage.assertLoginSuccess();
    });

    /*
    * Bug 1234: Asset Warranty not shows after enering Asset Wararnty Reading
    * Source: https://jira.com/browse/BUG-1234
    * Steps:
    * 1. Open Asset Register
    * 2. Click New button
    * 3. Enter Asset Number and Description
    * 4. Set Reading Type to Hours
    * 5. Save the asset
    * 6. Open Readings Module
    * 7. Add a Reading = 100 Hours
    * 8. Open WO Module
    * 9. Create a new WO with the above asset
    * Expected Result: 'Asset Warranty' dialog box should appear after selecting the Asset
    * Custom tags: @bug @regression
    */    
    
    test('Work Order Asset Warranty - Case 1 @bug @regression', async () => {
        const data = testData.case1;
        await assetPage.createNewAsset(data.assetNumber, data.assetDesc);
        await assetPage.addWarrantyAndReadingType(data.assetNumber);
        await readingPage.openReadingsModule();
        await readingPage.locateAndAddAssetReading(data.assetNumber, data.readingValue);
        await woPage.verifyWorkOrderAssetWararnty(data.assetNumber, data.workorderDesc);    
    });

    /**
     * Future use test case
     */
    /*
    test('Work Order Asset Warranty - Case 2', async () => {
        const data = testData.case2;
        await assetPage.createNewAsset(data);
        await assetPage.addWarrantyAndReadingType(data.assetNumber);
        await readingPage.openReadingsModule();
        await readingPage.locateAndAddAssetReading(data.assetNumber, data.readingValue);
        await woPage.verifyWorkOrderAssetWararnty(data.assetNumber, data.workorderDesc);
    });
    */
});
