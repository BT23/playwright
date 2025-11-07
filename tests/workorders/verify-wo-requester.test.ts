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
        const specificWONumber = JSON.parse(readFileSync(woDataFilePath, 'utf-8'));  
        await woPage.selectSpecificedWO(specificWONumber.woNumber);
        await woPage.clickWODetailsBtn();
        await woPage.clickDetailsTab();
        await woPage.verifyWORequester(woTestData.wodetails.Requester);
      });