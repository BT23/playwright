//import { test } from '../../fixtures';
    /*
     * Bug 1234: Contractor WO appears in Contractor User Portal prior to PO approval
    * Source: https://jira.com/browse/BUG-1234
    * Prerequisite:  
    * Store Options - Is Approvals used for Purchasing? has to be turned on
    * Contractor Supplier has not Contractor WO (i.e. a new user)
    * Steps:
    * 1. Open Asset Register
    * 2. Create a new Asset
    * 3. Open Contractor WO Listing
    * 4. Create a new Contractor WO
    * 5. Click 'Add PO' button
    * 6. DON'T approve the PO
    * 7. Logout
    * 8. Login as Contractor User portal user
    * Expected Result: PO Quote No should autofill
    * Custom tags: @bug @regression @contractorWO @PO
     

    test.only('Contractor User Portal - Case 4 @bug @regression @contractorwo @PO', async () => {
        const data = testData.case4;
        await assetPage.createNewAsset(data.assetNumber, data.assetDesc);
        await contractorwoPage.createContractorWO(data.contractorworkOrderDesc, data.assetNumber, data.contractor);
        await contractorwoPage.clickAddPOBtn();
        const poNumber: string = await contractorwoPage.getContractorWODetailsPONumber();
        await contractorwoPage.closeContractorWODetailsForm();
        await loginPage.logout();
        await loginPage.contractorUserLogin();
        await contractorportalPage.verifyContractorUserPortalHeader();
        await contractorportalPage.verifyPONumberNotInContractorPortalListing(poNumber);
    });  
*/