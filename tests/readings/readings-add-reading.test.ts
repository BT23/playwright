import { AssetPage } from '../../pages/assets/assetPage';
import { test } from '../fixtures';

    /*
    * Reference ID: Test Case: Asset Module should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Register
    * 2. Verfiy that the Asset Register header is displayed
    * Expected Result: Asset Register loads without errors
    * Custom tags: @smoke @feature-readings
    */
   /*
    test('Select the Asset Reading and add reading @smoke @feature-readings', async ({ assetPage, readingPage, readingTestData }) => {
        console.log("📝 Starting test: Create new asset with Reading Type using fixture data");        
        await assetPage.goto();
        await assetPage.createLevel1Asset(readingTestData.createreading.assetNumber, readingTestData.createreading.assetDesc);
        await assetPage.enterReadingType(readingTestData.createreading.details.ReadingType);
        await assetPage.clickBackBtn();
        await readingPage.goto();
        await readingPage.locateAndAddAssetReading(readingTestData.createreading.assetNumber, readingTestData.createreading.details.CurrentReading);
        await readingPage.verifyReadingAddedSuccessfully(readingTestData.createreading.assetNumber, readingTestData.createreading.details.CurrentReading);
    });
    */    
