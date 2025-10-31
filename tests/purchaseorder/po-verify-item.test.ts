
import { readFileSync } from 'fs';
import { test } from '../fixtures'


    /*
    * Test Case: Verify PO Item Cells
    * Preconditions: User is logged in and createPurchaseOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open PO Module
    * 2. Select Specificed PO
    * 3. Click Details button
    * 4. Click Items tab
    * 5. Verify PO Item Cells
    * Expected Result: PO Item Cells are verified successfully
    * Custom tags: @smoke @feature-po
    */ 

test('Verify PO Item Cells using fixture data @smoke @feature-po', async ({ poPage, testData, poDataFilePath }) => {
        // Read and parse the file
        const specificPONumber = JSON.parse(readFileSync(poDataFilePath, 'utf-8'));    
        await poPage.selectSpecificedPO(specificPONumber.poNumber);        
        await poPage.clickPODetailsBtn();
        await poPage.clickPOItemTab();

        await poPage.verifyPOItemRow({
            SupplierStockNumber: testData.SupplierStockNumber,
            Quantity: testData.Quantity,
            UOM: testData.UOM,
            UnitPrice: testData.UnitPrice
        });
});
