import { test } from '../fixtures';
/*
   * Bug 1234: Contractor Listing cannot filter by contractor
   * Source: https://jira.com/browse/BUG-1234
   * Steps:
   * 1. Open WO Listing
   * 2. Click 'Contractor' button
   * 3. Click 'Filter' button
   * 4. Enter Contractor
   * 5. Click Apply button
   * Expected Result: The Contractor Listing should display only those records that exactly match the selected or specified contractor criteria.
   * Custom tags: @bug @regression @feature-contractorwo
   */ 

   test('Contractor Listing Filter by Contractor @bug @regression @feature-contractorwo', async ({ contractorWOPage, contractorWOTestData }) => {
        console.log("📝 Starting test: Create a new Contractor Work Order on Contractor WO Listing");
        await contractorWOPage.goto();        
        await contractorWOPage.createContractorWO(contractorWOTestData.createcontractorwo.Description, contractorWOTestData.createcontractorwo.Asset, contractorWOTestData.createcontractorwo.Contractor);
        await contractorWOPage.clickBackBtn();
        console.log("📝 Starting test: Filter Contractor WO Listing by Contractor");        
        await contractorWOPage.openContractorListingFilter();
        await contractorWOPage.applyContractorFilter(contractorWOTestData.filterontractorwolisting.Contractor);
        await contractorWOPage.verifyContractorFilterApplied(contractorWOTestData.filterontractorwolisting.Contractor);
    });
