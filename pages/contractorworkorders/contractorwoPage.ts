import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';


export class ContractorWOPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*
    ************************************
    * Open Contractor Work Order Listing
    ************************************
    */
    async openContractorWOListing(): Promise<void> {
        // Check if the "History" button is visible
        const woButton = this.page.locator('[automation-button="WorkOrders"]');
        if (!(await woButton.isVisible())) {
            await helper.addModuleToMenu("WorkOrders");
            await this.page.waitForTimeout(1000);
        }
        
        // Click on the Work Orders button to open the Work Order module
        await helper.clickButton("WorkOrders");

        // Verify that the Work Order Listing header is displayed
        await helper.checkHeader("WorkOrderListingHeader");

        // Click Contractor button
        await helper.clickButton("Contractor");
    }

    /*
    ************************************
    * Open Contractor Work Order Listing
    ************************************
    */
    async createContractorWO(desc: string, assetNumber: string, vendor: string): Promise<void> {
        // Click on the Work Orders button to open the Work Order module
        await helper.clickButton("WorkOrders");

        // Verify that the Work Order Listing header is displayed
        await helper.checkHeader("WorkOrderListingHeader");

        // Click Contractor button
        await helper.clickButton("Contractor");

        // Click New button
        await helper.clickButton("New");

        // Fill in the Work Order details
        await helper.enterValueInDialog("CreateWorkOrder","Description", desc);        
        await helper.enterValueInDialog("CreateWorkOrder","Asset", assetNumber);

        // Select the first item from the supplier list
        await helper.selectFirstListItem();

        // Enter the supplier short name in the dialog/list
        const vendorShortName = vendor.split(' ')[0];
        await helper.enterValueInDialog("CreateWorkOrder", "Contractor", vendorShortName);

        // Select the first item from the supplier list
        await helper.selectFirstListItem();

        // Click the Create button to save the new Work Order
        await helper.clickButton("Create");        
  
        //await this.page.waitForTimeout(1000);

        //await helper.closePage();
    }

    /*
    **********************************************************************************
    * Set Contractor WO Due Start Date
    * This method waits for the DueStart field to be visible and editable,
    * then sets its value to a date 1 day in the future in "YYYY-MM-DDTHH:MM" format,
    * which is required for datetime-local input fields.
    * Otherwise, malformed format error throws
    **********************************************************************************
    */
    async setContractorDueStartDate(): Promise<string> {
        // Wait for the DueStart field to be visible and editable
        const dueStartField = this.page.locator('[automation-input="DueStart"]');
        await dueStartField.waitFor({ state: 'visible', timeout: 10000 });
        await expect(dueStartField).toBeEditable();

        // Set DueStart to a date 1 day in the future in "YYYY-MM-DDTHH:MM" format
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        // Format as "YYYY-MM-DDTHH:MM"
        const year = futureDate.getFullYear();
        const month = String(futureDate.getMonth() + 1).padStart(2, '0');
        const day = String(futureDate.getDate()).padStart(2, '0');
        const hours = String(futureDate.getHours()).padStart(2, '0');
        const minutes = String(futureDate.getMinutes()).padStart(2, '0');
        const futureDateStr = `${year}-${month}-${day}T${hours}:${minutes}`;

        await helper.enterValue("DueStart", futureDateStr);

        // Return the value for verification
        return futureDateStr;
    }

    /*
    *******************************
    * Get PO Number after adding PO
    *******************************
    */
    async getContractorWODetailsPONumber(): Promise<string> {
        // Locate the input field by automation-input name
        const poInput = this.page.locator('[automation-input="PurchaseOrderNo"]');
        await poInput.waitFor({ state: 'visible', timeout: 10000 });
        // Click if needed (optional, can be removed if not required)
        await poInput.click();
        await this.page.waitForTimeout(500);

        // Get the value of the PO Number
        const poNumber = await poInput.inputValue();
        return poNumber.trim();
    }

    /*
    **********************************
    * Set Quote Number button
    **********************************
    */
    async setQuoteNumber(quoteNumber: string): Promise<void> {
        await helper.enterValue("QuoteNo", quoteNumber)
        await this.page.waitForTimeout(1000);
    }

    /*
    **********************************
    * Click Add PO button
    **********************************
    */
    async clickAddPOBtn(): Promise<void> {
        await helper.clickButton("AddPO");
        await this.page.waitForTimeout(1000);

    }

    /*
    **********************************
    * Click Edit Invoice button
    **********************************
    */
    async clickEnterInvoiceBtn(): Promise<void> {
        await helper.clickButton("EnterInvoice");
        await this.page.waitForTimeout(1000);

    }
    
    /*
    **********************************
    * Click PO hyperlink
    **********************************
    */
    async clickPOHyperlink(): Promise<void> {
        // Locate the input field by automation-input name
        const poInput = this.page.locator('[automation-input="PurchaseOrderNo"]');
        await poInput.click();
        await this.page.waitForTimeout(1000);
    }

    /*
    ************************************************
    * Click Contractor Invoice Entry - Submit button
    ************************************************
    */
      async clickInvoiceEntrySubmitBtn(): Promise<void> {
        await helper.clickButtonInDialog("ContractorInvoiceEntry", "Submit");
        await this.page.waitForTimeout(1000);
    } 

    /*
    ************************************************
    * Click Contractor Invoice Entry - Approve button
    ************************************************
    */
      async clickInvoiceEntryApproveBtn(): Promise<void> {
        await helper.clickButtonInDialog("ContractorInvoiceEntry", "Approve");
        await this.page.waitForTimeout(1000);
    } 

    /*
    **********************************
    * Close Contractor WO Details Form
    **********************************
    */
      async closeContractorWODetailsForm(): Promise<void> {
        await helper.closePage();
        await this.page.waitForTimeout(1000);
    } 

    /*
    ************************************************
    * Click Contractor Invoice Entry - Close button
    ************************************************
    */
      async closeContractorInvoiceEntryForm(): Promise<void> {
        await helper.clickButtonInDialog("ContractorInvoiceEntry", "closeDialog");
        await this.page.waitForTimeout(1000);
    } 

    /*
    **********************
    * Open Listing Filter
    **********************
    */
    async openContractorListingFilter(): Promise<void> {
        await helper.clickButton("listingFilter");
    }

    /*
    ********************************
    * Open Contractor Listing Filter
    ********************************
    */
    async applyContractorFilter(filterContractor: string): Promise<void> {

        // Enter the supplier short name in the dialog/list
        const contractorShortName = filterContractor.split(' ')[0];

        await helper.enterValue("Contractor", contractorShortName);

        // Select the first item from the supplier list
        await helper.selectFirstListItem();

        await this.page.waitForTimeout(1000);
        
        // click Apply button
        await helper.clickButton("Apply");
    }    

    /*
    *************************************************************
    * Verify Contractor Listing filter by the selected Contractor
    *************************************************************
    */
    async verifyContractorFilterApplied(filterValue: string): Promise<void> {
            
    // After applying the filter
    await helper.selectRowByFieldName("ContractorWorkOrderListingGrid", "Contractor", filterValue);

    // Optionally, verify all visible rows have the expected contractor name
    const grid = this.page.locator('[automation-grid="ContractorWorkOrderListingGrid"]');
    const rows = grid.locator('[automation-row]');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        const contractorCell = row.locator('[automation-col="Contractor"]');
        const cellText = (await contractorCell.textContent())?.trim();
        expect(cellText).toBe(filterValue);
        }
    } 

}