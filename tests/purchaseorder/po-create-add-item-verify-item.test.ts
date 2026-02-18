
import { test } from '../fixtures'

    /*
    * Test Case: Create New Work Order successfully
    * This test creates a new PO using the data from createPurchaseOrderData.json 
    * Preconditions: User is logged in and createPurchaseOrderData.json is available
    * Steps:
    * 1. Open PO Module
    * 2. Click New button
    * 3. Enter Supplier
    * 4. Click Create button
    * 5. Add item with Quantity and Price
    * Expected Result: New WO created successfully and appears in the WO Listing
    * Custom tags: @smoke
    */ 

test('Add PO Item using fixture data @smoke @feature-po', async ({ poPage, poTestData}) => {
    console.log('🧪 Starting test: Create PO using fixture data');
        const rawPoNumber = await poPage.createPO(poTestData.createpo.SupplierCode);
        // Ensure we have a value and trim it
        const poNumber = rawPoNumber?.trim() ?? null;
        
    console.log('🧪 Starting test: Add PO Item using fixture data');    
        await poPage.addPOItem(poTestData.createpo.SupplierStockNumber, poTestData.createpo.Quantity);
        await poPage.clickBackBtn(); //Save and Back
        await poPage.selectSpecificedPO(poNumber!);
        await poPage.clickPODetailsBtn();
        await poPage.clickPOItemTab();
        
    console.log('🧪 Starting test: Verify added PO Item retained');        
        await poPage.verifyPOItemRow({
            SupplierStockNumber: poTestData.createpo.SupplierStockNumber,
            Quantity: poTestData.createpo.Quantity,
            UOM: poTestData.createpo.UOM,
            UnitPrice: poTestData.createpo.UnitPrice
        });        
});
