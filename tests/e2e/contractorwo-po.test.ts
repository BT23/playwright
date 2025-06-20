import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { AssetPage } from '../../pages/assets/assetPage';
import { WoPage } from '../../pages/workorders/woPage';
import { ContractorPortalPage } from '../../pages/contractoruserportal/contractorportalPage';
import { ContractorWOPage } from '../../pages/contractorworkorders/contractorwoPage';
import { PoPage } from '../../pages/purchaseorder/poPage';

import testData from '../../test-data/e2e/contractorwoPOData.json';

test.describe('Contractor Work Orders PO Tests', () => {
    let loginPage: LoginPage;
    let assetPage: AssetPage;
    let contractorportalPage: ContractorPortalPage;        
    let contractorwoPage: ContractorWOPage;
    let woPage: WoPage;
    let poPage: PoPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        assetPage = new AssetPage(page);
       contractorportalPage = new ContractorPortalPage(page);        
        contractorwoPage = new ContractorWOPage(page);
        woPage = new WoPage(page);
        poPage = new PoPage(page);

        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
        await loginPage.assertLoginSuccess();
    });

    /*
    * Bug 1234: PO Due Start Date do not autofill when creating PO from a Contractor WO
    * Source: https://jira.com/browse/BUG-1234
    * Steps:
    * 1. Open Asset Register
    * 2. Create a new Asset
    * 3. Open Contractor WO Listing
    * 4. Create a new Contractor WO
    * 5. Enter Due Start Date
    * 6. Click 'Add PO' button
    * 7. Click Purchase Order No hyperlink
    * Expected Result: PO Due Start Date should autofill
    * Custom tags: @bug @regression @contractorWO @PO
    */    
    test('Contractor WO PO Due Start Date autofill - Case 1 @bug @regression @contractorwo @PO', async () => {
        const data = testData.case1;
        await assetPage.createNewAsset(data.assetNumber, data.assetDesc, 2);
        await contractorwoPage.createContractorWO(data.contractorworkOrderDesc, data.assetNumber, data.contractor);
        const dueStart: string = await contractorwoPage.setContractorDueStartDate();
        await contractorwoPage.clickAddPOBtn();
        await contractorwoPage.clickPOHyperlink();
        await poPage.verifyPODueStartDate(dueStart);      
    });
 
    /*
     * Bug 1234: Quote Number do not autofill when creating PO from a Contractor WO
    * Source: https://jira.com/browse/BUG-1234
    * Steps:
    * 1. Open Asset Register
    * 2. Create a new Asset
    * 3. Open Contractor WO Listing
    * 4. Create a new Contractor WO
    * 5. Enter Quote Number
    * 6. Click 'Add PO' button
    * 7. Click Purchase Order No hyperlink
    * Expected Result: PO Quote No should autofill
    * Custom tags: @bug @regression @contractorWO @PO
    */    
    test('Contractor WO PO Quote Number autofill - Case 2 @bug @regression @contractorwo @PO', async () => {
        const data = testData.case2;
        await assetPage.createNewAsset(data.assetNumber, data.assetDesc, 2);
        await contractorwoPage.createContractorWO(data.contractorworkOrderDesc, data.assetNumber, data.contractor);
        await contractorwoPage.setQuoteNumber(data.QuoteNo);
        await contractorwoPage.clickAddPOBtn();
        await contractorwoPage.clickPOHyperlink();
        await poPage.verifyPOQuoteNumber(data.QuoteNo);
    });   

    /*
     * Bug 1234: Quote Number do not autofill when creating PO from a Contractor WO
    * Source: https://jira.com/browse/BUG-1234
    * Prerequisite:  Store Options - Is Approvals used for Purchasing? has to be turned on
    * Steps:
    * 1. Open Asset Register
    * 2. Create a new Asset
    * 3. Open Contractor WO Listing
    * 4. Create a new Contractor WO
    * 5. Enter Quote Number
    * 6. Click 'Add PO' button
    * 7. Click Purchase Order No hyperlink
    * Expected Result: PO Quote No should autofill
    * Custom tags: @bug @regression @contractorWO @PO
    */    
    test('Contractor WO PO Transaction after subimitting and approving invoice - Case 3 @bug @regression @contractorwo @PO', async () => {
        const data = testData.case3;
        await assetPage.createNewAsset(data.assetNumber, data.assetDesc, 2);
        await contractorwoPage.createContractorWO(data.contractorworkOrderDesc, data.assetNumber, data.contractor);
        await contractorwoPage.clickAddPOBtn();  
        await contractorwoPage.clickPOHyperlink();
        await poPage.clickPOApproveBtn();
        await poPage.closePODetails();
        await contractorwoPage.clickEnterInvoiceBtn();
        await contractorwoPage.clickInvoiceEntrySubmitBtn();
        await contractorwoPage.clickInvoiceEntryApproveBtn();
        await contractorwoPage.closeContractorInvoiceEntryForm();
        await contractorwoPage.clickPOHyperlink();
        await poPage.clickPOTransactionsTab();
        await poPage.verifyPOContractorInvoiceTransactions();
    });  

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
    */    
    test.only('Contractor User Portal - Case 4 @bug @regression @contractorwo @PO', async () => {
        const data = testData.case4;
        await assetPage.createNewAsset(data.assetNumber, data.assetDesc, 2);
        await contractorwoPage.createContractorWO(data.contractorworkOrderDesc, data.assetNumber, data.contractor);
        await contractorwoPage.clickAddPOBtn();
        const poNumber: string = await contractorwoPage.getContractorWODetailsPONumber();
        await contractorwoPage.closeContractorWODetailsForm();
        await loginPage.logout();
        await loginPage.contractorUserLogin();
        await contractorportalPage.verifyContractorUserPortalHeader();
        await contractorportalPage.verifyPONumberNotInContractorPortalListing(poNumber);
    });  

});