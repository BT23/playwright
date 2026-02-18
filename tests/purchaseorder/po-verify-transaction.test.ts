import { readFileSync } from 'fs';
import { test } from '../fixtures'

    /*
    * Test Case: Verify PO Transaction successfully
    * Preconditions: User is logged in and createPurchaseOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open PO Module
    * 2. SElect Specific PO
    * 3. Click Details button
    * 4. Click Transactions tab
    * Expected Result: PO Transactions are displayed correctly
    * Custom tags: @smoke @feature-po
    */ 
/*
test('Verify PO Transaction using fixture data @smoke @feature-po', async ({ poPage}) => {
    console.log('🧪 Starting test: Filter PO Listing with All Received status');
    await poPage.openListingFilter();    
    await poPage.enabledFilterPOStatusAllReceived();
    await poPage.closeListingFilter();

    console.log('🧪 Starting test: Select PO 000001 with All Received status');    
    // Select the PO with status = All Received
    await poPage.selectSpecificedPO('000001');
    await poPage.clickPODetailsBtn();
    await poPage.clickPOTransactionsTab();
    await poPage.verifyPOReceiptActionTransactions();
});
*/