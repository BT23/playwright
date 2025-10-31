
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

test('Create PO using fixture data @smoke @feature-po', async ({ poPage,testData}) => {
        await poPage.selectSpecificedPO('000092');
        await poPage.clickPODetailsBtn();
        await poPage.addPOItem(testData);
        await poPage.clickBackBtn(); //Save and Back
});
