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
        console.log('🧪 Starting test: Create new WO, enter Details and verify that the details are retained.');
        await woPage.goto(); // Open WO Module

        // Create the WO and capture the number instead of reading from file (as WO number does not exist when running the worker in parallel)
        const rawWoNumber = await woPage.createWO(woTestData.createwo.Asset, woTestData.createwo.Description);
        console.log(`Created WO Number: ${rawWoNumber}`);
        
        // Ensure we have a value and trim it
        const woNumber = rawWoNumber?.trim() ?? null;
        console.log(`Trimmed WO Number: ${woNumber}`);

        await woPage.clickBackBtn(); // Save and Back

        await woPage.selectSpecificedWO(woNumber!);
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