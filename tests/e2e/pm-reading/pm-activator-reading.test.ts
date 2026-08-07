import { test } from '../../fixtures';
    /*
    * GitHub Issue ID: 3910 - Preventative Maintenance - Activator - Activator Listing Request Failed with Low Average Using
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Register
    * 2. Create a new Asset with Reading Type = Hours
    * 3. Open Readings module
    * 4. Add two readings for the asset created in step 2
    * 5. Reading 1: Reading date time = 2026-05-03 T09:00:00Z, Reading value = 1, 
    * 6. Reading 2: Reading date time = 2026-05-28 T10:30:00Z, Reading value = 1.2
    * 7. Open PM Listing
    * 8. Create a new PM with a high frequency (e.g. 50000) and frequency type = Hours
    * 9. Add the asset created in step 2 to the PM created in step 8
    * 10. Enter Last Done Date = 2026-03-19 T10:30:00Z and Last Done Reading = 2
    * 11. Click Back button
    * 12. Click the Activator button
    * Expected Result: Able to view activator.
    * Custom tags: @regression @feature-pm @feature-reading
    */
   
    test('Create New PM with a high Frequency using fixture data @regression @feature-pm @feature-reading', async ({ assetPage, pmPage, readingPage, e2eTestData }) => {
        console.log("📝 Starting test: Create New PM with a high Frequency");
        console.log("📝 Create New Asset with Reading Type = Hours");
        await assetPage.goto();
        await assetPage.createLevel1Asset(e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.assetNumber, e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.assetDesc);
        await assetPage.enterReadingType(e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.readingType);
        await assetPage.clickBackBtn();
        console.log("📝 Create two readings for the asset");
        await readingPage.goto();
        await readingPage.locateAndAddAssetReading(e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.assetNumber, e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.readingValue1, e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.readingDate1);
        await readingPage.locateAndAddAssetReading(e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.assetNumber, e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.readingValue2, e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.readingDate2);
        console.log("📝 Create a new PM with a high frequency");
        await pmPage.goto();
        const pmNumber = await pmPage.createPM(e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.pmDesc, e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.frequency, e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.frequencyType);
        await pmPage.addPMAsset(e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.assetNumber);
        await pmPage.enterLastDoneDate(e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.LastDoneDate);
        await pmPage.enterLastDoneReading(e2eTestData.pmactivator.pmReadingData.CasePmActivatorReadingLowAvg.LastDoneReading);
        await pmPage.clickBackBtn();
        console.log("📝 Open the PM Activator");
        await pmPage.clickActivatorBtn();
        await pmPage.selectSpecificedPM(pmNumber!);
        console.log("📝 Test completed" + pmNumber + "appears on Activator.");
    });
    