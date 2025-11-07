import { readFileSync } from 'fs';
import { test } from '../fixtures'
   /*
    * Test Case: Fill in WO Details - Details Tab successfully
    * Preconditions: User is logged in and createWorkOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open Work Orders module
    * 2. Open the details of an existing WO
    * 3. Fill in all fields in the Details tab
    * 4. Save the changes
    * Expected Result: All fields in the Details tab are filled in successfully
    * The WO details are saved without errors
    * Custom tags: @smoke @feature-wo
    * */

    test('Fill in WO Details using fixture data @smoke @feature-wo', async ({ woPage, woTestData,woDataFilePath }) => {
        const specificWONumber = JSON.parse(readFileSync(woDataFilePath, 'utf-8'));  
        await woPage.selectSpecificedWO(specificWONumber.woNumber);
        await woPage.clickWODetailsBtn();
        await woPage.clickDetailsTab();
        
        // Enter Start Date
        await woPage.enterStartDateTime(woTestData.wodetails.Started);

        // Enter Account Code   
        await woPage.enterAccountCode(woTestData.wodetails.AccountCode);

        // Enter Job Type
        await woPage.enterJobType(woTestData.wodetails.JobType);

        // Enter Department
        await woPage.enterDepartment(woTestData.wodetails.Department);

        await woPage.clickBackBtn();
    });