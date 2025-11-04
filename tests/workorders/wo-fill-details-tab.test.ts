import { readFileSync } from 'fs';
import { test } from '../fixtures'
   /*
    * Test Case: Fill in WO Details - Details Tab
    * This test fills in the details tab of the WO details form
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Work Orders
    * 2. Open the details of an existing WO
    * 3. Fill in all fields in the Details tab
    * 4. Save the changes
    * Expected Result: All fields in the Details tab are filled in successfully
    * The WO details are saved without errors
    * Custom tags: @regression
    * */

    test('Fill in WO Details using fixture data @smoke @feature-wo', async ({ woPage,woDataFilePath }) => {
        const specificWONumber = JSON.parse(readFileSync(woDataFilePath, 'utf-8'));  
        await woPage.selectSpecificedWO(specificWONumber.woNumber);
        await woPage.clickWODetailsBtn();
        await woPage.clickDetailsTab();
        
        // Enter Start Date
        await woPage.enterStartDateTime()

        // Enter Account Code   
        await woPage.enterAccountCode();

        // Enter Job Type
        await woPage.enterJobType();

        // Enter Department
        await woPage.enterDepartment();

        await woPage.clickBackBtn();
    });