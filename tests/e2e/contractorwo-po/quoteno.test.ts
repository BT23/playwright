import { test } from '../../fixtures';
     /*
    * Reference ID: Test Case: Fill in Quote Number in Contractor WO and verify in PO
    * Preconditions: User is logged in and createContractorWOPOData.json is available. Fixture data used.
    * Steps:
    * 1. Open Work Orders
    * 2. Verfiy that the Work Order Listing header is displayed
    * 3. Click 'Contractor' button
    * 4. Click 'New' button
    * 5. Enter Description, Asset and Contractor
    * 6. Click 'Create' button
    * 7. Set Quote Number = "Test Quote No" + current timestamp
    * 8. Click 'Add PO' button
    * 9. Click on the PO hyperlink to open the PO details
    * 10. Verify that the Quote Number in the PO matches the Quote Number set in the Contractor WO
    * Expected Result: Quote Number set in Contractor WO should be correctly reflected in the associated PO
    * Custom tags: @smoke @bug @regression @feature-contractorWO @feature-po
    */

    test('Fill in Quote Number and verify in PO @smoke @bug @regression @feature-contractorWO @feature-po', async ({ contractorWOPage, poPage, cwoPoTestData }) => {
        console.log("📝 Starting test: Create a new Contractor Work Order on Contractor WO Listing");
        await contractorWOPage.goto();  
        await contractorWOPage.createContractorWO(cwoPoTestData.quotenumber.CaseQuoteNoCheck.Description, cwoPoTestData.quotenumber.CaseQuoteNoCheck.Asset, cwoPoTestData.quotenumber.CaseQuoteNoCheck.contractor);
        const quoteNo: string = await contractorWOPage.setQuoteNumber("Auto Quote " + new Date().getTime());
        console.log("📝 Quote Number set to: " + quoteNo);
        console.log("📝 Starting test: Click Add PO button");
        await contractorWOPage.clickAddPOBtn();
        console.log("📝 Starting test: Click PO Hyperlink in Contractor WO");
        await contractorWOPage.clickPOHyperlink();
        console.log("📝 Starting test: Verify Quote Number in PO");
        await poPage.verifyPOQuoteNumber(quoteNo);
    });
