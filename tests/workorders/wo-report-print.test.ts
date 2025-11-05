import { readFileSync } from 'fs';
import { test } from '../fixtures'
   /*
    * Test Case: Print Work Order Report from Listing using fixture data
    * Preconditions: User is logged in. Fixture data used.
    * Steps:
    * 1. Open WO Listing
    * 2. Select the specified WO
    * 3. Click 'Print' button
    * Expected Result: Verify Work Order Report header is displayed successfully. Howenver, actual printing cannot be verified in automation.
    * Custom tags: @smoke @feature-wo
    * */

    test('Print WO on listing using fixture data @smoke @feature-wo', async ({ woPage,woDataFilePath }) => {
        const specificWONumber = JSON.parse(readFileSync(woDataFilePath, 'utf-8'));  
        await woPage.selectSpecificedWO(specificWONumber.woNumber);        
        //await woPage.printWOReportOnListing(specificWONumber);
        await woPage.printWOReport(specificWONumber, false)
    });

   /*
    * Test Case: Print Work Order Report in Specified WO using fixture data
    * Preconditions: User is logged in. Fixture data used.
    * Steps:
    * 1. Open WO Listing
    * 2. Select the specified WO
    * 3. Click Details button
    * 4. Click 'Print' button
    * Expected Result: Verify Work Order Report header is displayed successfully. Howenver, actual printing cannot be verified in automation.
    * Custom tags: @smoke @feature-wo
    * */

    test('Print WO in Details form using fixture data @smoke @feature-wo', async ({ woPage,woDataFilePath }) => {
        const specificWONumber = JSON.parse(readFileSync(woDataFilePath, 'utf-8'));  
        await woPage.selectSpecificedWO(specificWONumber.woNumber);        
        await woPage.clickWODetailsBtn();
        //await woPage.printWOReportInDetailsForm(specificWONumber);
        await woPage.printWOReport(specificWONumber, true)
    });