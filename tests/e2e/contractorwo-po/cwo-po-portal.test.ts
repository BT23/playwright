import { test } from '../../fixtures';
    /*
    * Reference ID: Test Case: Fill in Due Start Date in Contractor WO and verify in PO
    * Preconditions: User is logged in and createContractorWOPOData.json is available. Fixture data used.
    * Contractor Supplier has not Contractor WO (i.e. a new user)
    * Steps:
    * 1. Open Contractor WO Listing
    * 2. Create a new Contractor WO
    * 3. Set Quote Amount
    * 5. Click 'Add PO' button
    * 6. 
    * 7. Logout
    * 8. Login as Contractor User portal user
    * Expected Result: PO Quote No should autofill
    * Custom tags: @smoke @bug @regression @feature-contractorWO @feature-po @feature-contractor-porta
    */
/*
    test.only('PO Contractor User Portal @smoke @bug @regression @feature-contractorWO @feature-po @feature-contractor-portal' , async ({ contractorWOPage, loginPage, contractorPortalPage, cwoPoTestData }) => {
        console.log("📝 Starting test: Create a new Contractor Work Order on Contractor WO Listing");
        await contractorWOPage.createContractorWO(cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.Description, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.Asset, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.contractor);
        await contractorWOPage.setQuoteAmount(cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.QuoteAmount);
        await contractorWOPage.clickAddPOBtn();
        const poNumber: string = await contractorWOPage.getContractorWODetailsPONumber();
        await contractorWOPage.clickBackBtn();
        await loginPage.logout();
        await loginPage.contractorUserLogin();
        await contractorPortalPage.verifyContractorUserPortalHeader();
        await contractorPortalPage.verifyPONumberNotInContractorPortalListing(poNumber);
    });  
*/