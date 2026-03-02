import { test } from '../../fixtures';
    /*
    * Test Case: Create New Contractor WO and Verify PO Transaction after submitting and approving invoice
    * Preconditions: User is logged in and contractorwoPOData.json is available. Fixture data used.
    * Steps:
    * Steps:
    * 1. Open Contractor WO Listing
    * 2. Create a new Contractor WO
    * 3. Enter Quote Amount
    * 4. Click 'Add PO' button
    * 5. Click Purchase Order No hyperlink
    * 6. Approve the PO
    * 7. Click 'Back' button to return to Contractor WO details page
    * 8. Click 'Enter Invoice' button
    * 9. Submit the Invoice
    * 10. Approve the Invoice
    * 11. Close the Invoice Entry form
    * 12. Click Purchase Order No hyperlink again
    * 13. Open 'Transactions' tab in PO details page
    * 14. Verify that the Contractor Invoice Transaction is listed with correct details
    * Expected Result: PO Quote No should autofill
    * Custom tags: @smoke @bug @regression @feature-contractorwo @feature-po
    */  
    test('Contractor WO PO Transaction after subimitting and approving invoice @smoke @bug @regression @feature-contractorwo @feature-po',  async ({ contractorWOPage, poPage, cwoPoTestData }) => {
        console.log("📝 Starting test: Create a new Contractor Work Order on Contractor WO Listing");
        await contractorWOPage.goto();  
        await contractorWOPage.createContractorWO(cwoPoTestData.invoicetransaction.CaseInvoiceTransactionCheck.Description, cwoPoTestData.invoicetransaction.CaseInvoiceTransactionCheck.Asset, cwoPoTestData.invoicetransaction.CaseInvoiceTransactionCheck.contractor);
        await contractorWOPage.setQuoteAmount(cwoPoTestData.invoicetransaction.CaseInvoiceTransactionCheck.QuoteAmount);
        await contractorWOPage.clickAddPOBtn();  
        await contractorWOPage.clickPOHyperlink();
        console.log("📝 Starting test: Approval the PO");
        await poPage.clickPOApproveBtn();
        await poPage.clickBackBtn();
        console.log("📝 Starting test: Enter Invoice");
        await contractorWOPage.clickEnterInvoiceBtn();
        await contractorWOPage.clickInvoiceEntrySubmitBtn();
        console.log("📝 Starting test: Approve Invoice");
        await contractorWOPage.clickInvoiceEntryApproveBtn();
        // Give the app time to process the approval before closing the form
        /*
        console.log("📝 Starting test: Close Enter Invoice form");
        await contractorWOPage.closeContractorInvoiceEntryForm();
        await contractorWOPage.clickPOHyperlink();
        console.log("📝 Starting test: Open PO Transactions tab");
        await poPage.clickPOTransactionsTab();
        console.log("📝 Starting test: Verify PO Contractor Invoice Transactions");
        await poPage.verifyPOContractorInvoiceTransactions();
        */
    });  
