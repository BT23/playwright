import { readFileSync } from 'fs';
import { test } from '../fixtures'
    
    /*
    * Test Case: Add Work Order Spare successfully
    * This test 
    * Preconditions: User is logged in. Fixture data is available.
    * Steps:
    * 1. Open Work Orders
    * 2. Select a Work Order
    * 3. Click Spares tab
    * 3. Add a Spare by entering Catalogue item
    * 4. Save the Spare
    * Expected Result: New spare is added to work order successfully
    * Custom tags: @smoke
    */    
    test('Add WO Spares using fixture data @smoke @feature-wo', async ({ woPage, woTestData, woDataFilePath }) => {
        //const specificWONumber = JSON.parse(readFileSync(woDataFilePath, 'utf-8'));  
        
        // Create the WO and capture the number instead of reading from file (as WO number does not exist when running the worker in parallel)
        const rawWoNumber = await woPage.createWO(woTestData.createwo.Asset, woTestData.createwo.Description);
        console.log(`Created WO Number: ${rawWoNumber}`);
        
        // Ensure we have a value and trim it
        const woNumber = rawWoNumber?.trim() ?? null;
        console.log(`Trimmed WO Number: ${woNumber}`);

        await woPage.clickBackBtn(); // Save and Back

        await woPage.selectSpecificedWO(woNumber!);
        await woPage.clickWODetailsBtn();
        await woPage.clickSparesTab();
        await woPage.addWOSpare(woTestData.wospares.Item, woTestData.wospares.EstimatedQuantity);
        await woPage.clickBackBtn();
      });