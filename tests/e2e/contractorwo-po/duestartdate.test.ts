import { test } from '../../fixtures';
     /*
    * Reference ID: Test Case: Fill in Due Start Date in Contractor WO and verify in PO
    * Preconditions: User is logged in and createContractorWOPOData.json is available. Fixture data used.
    * Steps:
    * 1. Open Work Orders
    * 2. Verfiy that the Work Order Listing header is displayed
    * 3. Click 'Contractor' button
    * 4. Click 'New' button
    * 5. Enter Description, Asset and Contractor
    * 6. Click 'Create' button
    * 7. Set Due Start Date = current date + 1 day
    * 8. Click 'Add PO' button
    * 9. Click on the PO hyperlink to open the PO details
    * 10. Verify that the Due Start Date in the PO matches the Due Start Date set in the Contractor WO
    * Expected Result: Due Start Date set in Contractor WO should be correctly reflected in the associated PO
    * Custom tags: @smoke @bug @regression @feature-contractorWO @feature-po
    */

    test('Fill in Due Start Date and verify in PO @smoke @bug @regression @feature-contractorWO @feature-po', async ({ contractorWOPage, poPage, cwoPoTestData }) => {
        console.log("📝 Starting test: Create a new Contractor Work Order on Contractor WO Listing");
        await contractorWOPage.goto();  
        await contractorWOPage.createContractorWO(cwoPoTestData.duestartdate.CaseDueStartDateCheck.Description, cwoPoTestData.duestartdate.CaseDueStartDateCheck.Asset, cwoPoTestData.duestartdate.CaseDueStartDateCheck.contractor);
        const dueStart: string = await contractorWOPage.setContractorDueStartDate(1);
        console.log("📝 Due Start Date set to: " + dueStart);
        console.log("📝 Starting test: Click Add PO button");
        await contractorWOPage.clickAddPOBtn();
        console.log("📝 Starting test: Click PO Hyperlink in Contractor WO");
        await contractorWOPage.clickPOHyperlink();
        console.log("📝 Starting test: Verify Due Start Date in PO");
        await poPage.verifyPODueStartDate(dueStart);
    });
