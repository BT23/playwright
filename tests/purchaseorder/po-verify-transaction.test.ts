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

test('Verify PO Transaction using fixture data @smoke @feature-po', async ({ poPage, testData }) => {
        await poPage.clickPODetailsBtn();
        await poPage.clickPOTransactionsTab();
        await poPage.verifyPOContractorInvoiceTransactions();
});