import { readFileSync } from 'fs';
import { test } from '../fixtures'
    
    /*
    * Test Case: Verify WO Requester Populated successfully
    * This test 
    * Preconditions: User is logged in. Fixture data is available.
    * Steps:
    * 1. Open Work Orders module
    * 2. Select a Work Order
    * 3. Click Details tab
    * 4. Verify Requester field is populated with correct value
    * Expected Result: Requester field is populated correctly
    * Custom tags: @smoke
    */    
    test('Verify WO Requester using fixture data @smoke @feature-wo', async ({ woPage, woTestData, woDataFilePath }) => {
        //const specificWONumber = JSON.parse(readFileSync(woDataFilePath, 'utf-8'));  

        // Create the WO and capture the number instead of reading from file (as WO number does not exist when running the worker in parallel)
        const rawWoNumber = await woPage.createWO(woTestData.createwo.Asset, woTestData.createwo.Description);
        // Ensure we have a value and trim it
        const woNumber = rawWoNumber?.trim() ?? null;
        await woPage.enterRequester(woTestData.wodetails.Requester);
        await woPage.clickBackBtn(); // Save and Back

        await woPage.selectSpecificedWO(woNumber!);
        await woPage.clickWODetailsBtn();
        await woPage.clickDetailsTab();
        await woPage.verifyWORequester(woTestData.wodetails.Requester);
      });