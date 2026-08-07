import { test } from '../../fixtures';
    /*
    * GitHub Issue ID: 5495 - Purchase Orders - WO purchase orders - PO's made from WO's do not auto generate fields until the work order section is tabbed over
    * Preconditions: User is logged in
    * Steps:
    * 1. Create a new Asset
    * 2. Create a new Work Order for the Asset
    * 3. Enter Account Code in the Work Order
    * 4. Click on Spares Tab
    * 5. Click Add PO button
    * 6. Enter Supplier Code in the PO
    * 7. Click Create button to create the PO
    * 8. Click on PO Item Tab
    * 9. Add a PO Item with Supplier Stock Number and Quantity
    * 10. Verify that the Work Order and Account Code are retained in the PO Item row
    * Expected Result: WO and Account Code in WO are copied over to PO Item row.
    * Custom tags: @regression @feature-wo @feature-po
    */
   
    test.only('Click Add PO in WO Spares using fixture data @regression @feature-wo @feature-po', async ({ assetPage, woPage,poPage, e2eTestData }) => {
        console.log("📝 Starting test: WO Spares Add PO");
        await assetPage.goto();
        await assetPage.createLevel1Asset(e2eTestData.woPo.woPOData.CaseWoSparesAddPo.assetNumber, e2eTestData.woPo.woPOData.CaseWoSparesAddPo.assetDesc);
        await assetPage.clickBackBtn();
        await woPage.goto();
        const woNumber = await woPage.createWO(e2eTestData.woPo.woPOData.CaseWoSparesAddPo.assetNumber, e2eTestData.woPo.woPOData.CaseWoSparesAddPo.woDesc);
        if (!woNumber) throw new Error('Failed to create work order');
        await woPage.enterAccountCode(e2eTestData.woPo.woPOData.CaseWoSparesAddPo.accountCode);
        await woPage.clickSparesTab();
        await woPage.clickAddPOBtn();
        await poPage.enterPOSupplier(e2eTestData.woPo.woPOData.CaseWoSparesAddPo.SupplierCode);
        const poNumber = await poPage.clickCreateBtn();
        poPage.clickPOItemTab();
        poPage.addPOItem(e2eTestData.woPo.woPOData.CaseWoSparesAddPo.SupplierStockNumber, e2eTestData.woPo.woPOData.CaseWoSparesAddPo.Quantity);
        console.log('🧪 Starting test: Verify WO and Account Code retained');        
        await poPage.verifyPOItemRow({
            SupplierStockNumber: e2eTestData.woPo.woPOData.CaseWoSparesAddPo.SupplierStockNumber,
            Quantity: e2eTestData.woPo.woPOData.CaseWoSparesAddPo.Quantity,
            AccountCode: e2eTestData.woPo.woPOData.CaseWoSparesAddPo.accountCode,
            WorkOrder: woNumber
        });
        poPage.clickBackBtn();
        console.log(`📝 Test Completed. Created PO Number: ${poNumber}`);
    });
    