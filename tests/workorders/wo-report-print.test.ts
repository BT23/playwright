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

    test('Print WO on listing using fixture data @smoke @feature-wo', async ({ woPage, woTestData }) => {
        console.log('🧪 Starting test: Create WO using fixture data');
        await woPage.goto(); // Open WO Module
        // Create the WO and capture the number instead of reading from file (as WO number does not exist when running the worker in parallel)
        const rawWoNumber = await woPage.createWO(woTestData.createwo.Asset, woTestData.createwo.Description);
        // Ensure we have a value and trim it
        const woNumber = rawWoNumber?.trim() ?? null;        
        await woPage.clickBackBtn();
        console.log('🧪 Starting test: Print WO on listing');
        await woPage.selectSpecificedWO(woNumber!);   
        await woPage.printWOReport(woNumber!, false)
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

    test('Print WO in Details form using fixture data @smoke @feature-wo', async ({ woPage,woTestData }) => {
        console.log('🧪 Starting test: Create WO using fixture data');
        await woPage.goto(); // Open WO Module
        // Create the WO and capture the number instead of reading from file (as WO number does not exist when running the worker in parallel)
        const rawWoNumber = await woPage.createWO(woTestData.createwo.Asset, woTestData.createwo.Description);
        // Ensure we have a value and trim it
        const woNumber = rawWoNumber?.trim() ?? null;        
        await woPage.clickBackBtn();
        console.log('🧪 Starting test: Print WO in Details');
        await woPage.selectSpecificedWO(woNumber!);        
        await woPage.clickWODetailsBtn();
        await woPage.printWOReport(woNumber!, true)
    });