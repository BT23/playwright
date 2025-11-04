import { readFileSync } from 'fs';
import { test } from '../fixtures'
    
    /*
    * Test Case: Add Work Order Spare successfully
    * This test 
    * Preconditions: User is logged in and .json is available
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
        const specificWONumber = JSON.parse(readFileSync(woDataFilePath, 'utf-8'));  
        await woPage.selectSpecificedWO(specificWONumber.woNumber);
        await woPage.clickWODetailsBtn();
        await woPage.clickSparesTab();
        await woPage.addWOSpare(woTestData.spares.Item, woTestData.spares.EstimatedQuantity);
        await woPage.clickBackBtn();
      });