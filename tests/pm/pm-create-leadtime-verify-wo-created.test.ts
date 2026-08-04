import { test } from '../fixtures';
    /*
    * GitHub Issue ID: 4420 - PM - Activator - Lead time not working
    * Preconditions: User is logged in
    * Steps:
    * 1. Create a PM, with a 31 days frequency
    * 2. Set a lead time to 31 days
    * 3. Add a asset with the last done date of today
    * 4. Go to the activator and set the 'Days in Advance to' to 1 days
    * 5. Select the PM created in step 1
    * 6. Click on Raise Work Order
    * 7. Open WO Listing
    * 8. Verify that the work order appears in the listing
    * Expected Result: A work order is created.
    * Custom tags: @smoke @feature-pm
    */
    test('Create New PM using fixture data @smoke @feature-pm', async ({ assetPage, woPage, pmPage, pmTestData }) => {
        console.log("📝 Starting test: Create New PM Asset");
        await assetPage.goto();
        await assetPage.createLevel1Asset(pmTestData.createpm.PMAsset, pmTestData.createpm.AssetDescription);
        await assetPage.clickBackBtn();
        console.log("📝 Starting test: Create New PM");
        await pmPage.goto();
        const rawPmNumber = await pmPage.createPM(pmTestData.createpm.PMDescription,pmTestData.createpm.Frequency, pmTestData.createpm.FrequencyType);
        const pmNumber = rawPmNumber?.trim() ?? null;
        await pmPage.enterLeadTime(pmTestData.createpm.LeadTime);
        await pmPage.addPMAsset(pmTestData.createpm.PMAsset);
        await pmPage.clickBackBtn();
        await pmPage.clickActivatorBtn();
        await pmPage.enterActivatorDaysinAdvance(pmTestData.createpm.DaysinAdvance);
        await pmPage.selectSpecificedPM(pmNumber!);
        const workOrderNumber = await pmPage.clickRaiseWOBtn();
        console.log("📝 Work Order Number:", workOrderNumber); 
        await woPage.goto();
        await woPage.selectSpecificedWO(workOrderNumber!);
        console.log("📝 Raised PM WO appears on WO Listing");
        console.log("📝 Test completed: PM WO raised");
    });