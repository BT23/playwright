import { test } from '../../fixtures';
    /*
    * Reference ID: Test Case: Fill in Due Start Date in Contractor WO and verify in PO
    * Preconditions: User is logged in and createContractorWOPOData.json is available. Fixture data used.
    * Contractor Supplier has not Contractor WO (i.e. a new user)
    * Steps:
    * 1. Open Users Listing
    * 2. Create a new Contractor Portal User
    * 3. Click back button to go back to Users listing
    * 4. Open Contractor WO Listing
    * 5. Create a new Contractor WO with the Contractor Portal User created in step 2
    * 6. Set Quote Amount
    * 7. Click 'Add PO' button
    * 8. Get the PO Number from Contractor WO details page and click back button to go to Contractor WO listing
    * 9. Logout
    * 10. Login as Contractor User portal user
    * 11. Verify the PO Number is visible in Contractor User Portal listing
    * Expected Result: PO Number should be visible in Contractor User Portal listing
    * Custom tags: @smoke @bug @regression @feature-contractorWO @feature-po @feature-contractor-portal
    */
/*
    test.only('PO Contractor User Portal @smoke @bug @regression @feature-contractorWO @feature-po @feature-contractor-portal' , async ({ contractorWOPage, loginPage, contractorPortalPage, usersPage, cwoPoTestData }) => {
        console.log("📝 Starting test: Create a new Contractor Portal User");
        await usersPage.goto();
        await usersPage.createNewUser(cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.FirstName, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.LastName, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.UserName, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.Type, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.Password, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.ConfirmPassword);
        await usersPage.clickBackBtn();

        console.log("📝 Starting test: Create a new Contractor Work Order on Contractor WO Listing");        
        await contractorWOPage.goto();
        await contractorWOPage.createContractorWO(cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.Description, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.Asset, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.contractor);
        await contractorWOPage.setQuoteAmount(cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.QuoteAmount);
        await contractorWOPage.clickAddPOBtn();
        const poNumber: string = await contractorWOPage.getContractorWODetailsPONumber();
        await contractorWOPage.clickBackBtn();

        console.log("📝 Starting test: Login as Contractor User Portal User");
        await loginPage.logout();
        await loginPage.contractorUserLogin(cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.UserName, cwoPoTestData.pocontractorportal.CasePoContractorPortalCheck.Password);
        await contractorPortalPage.verifyContractorUserPortalHeader();
        await contractorPortalPage.verifyPONumberNotOnContractorPortalListing(poNumber);
    });  
*/

