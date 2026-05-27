import { test } from '../fixtures';
    /*
    * GitHub Issue ID: 4420 - PM - Activator - Lead time not working
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Preventative Maintenance 
    * 2. Verfiy that the PM header is displayed
    * Expected Result: PM loads without errors
    * Custom tags: @smoke @feature-pm
    */
    test('Create New PM using fixture data @smoke @feature-pm', async ({ pmPage, pmTestData, pmDataFilePath }) => {
        console.log("📝 Starting test: Create New PM");
        await pmPage.goto();
        await pmPage.createPM(pmTestData.createpm.PMDescription,pmTestData.createpm.Frequency, pmTestData.createpm.FrequencyType);
        await pmPage.enterLeadTime(pmTestData.createpm.LeadTime);
        await pmPage.clickBackBtn();
    });