import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';


export class ContractorWOPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    async goto() {
        await this.openContractorWOListing();
    }

    /*
    ************************************
    * Open Contractor Work Order Listing
    ************************************
    */
    async openContractorWOListing(): Promise<void> {
        // Wait for element visibility using smart wait
        const navButton = this.page.locator('[automation-button="NavItemWorkOrders"]');
        await navButton.waitFor({ state: 'visible', timeout: 5000 });

        await helper.clickButton("NavItemWorkOrders");

        // Wait for page to load after navigation
        await this.page.waitForLoadState('networkidle');

        // Verify header is displayed
        const header = this.page.locator('[automation-header="WorkOrderListingHeader"] span');
        await header.waitFor({ state: 'visible', timeout: 5000 });
        
        // Wait for element visibility using smart wait
        const contractorButton = this.page.locator('[automation-button="Contractor"]');
        await contractorButton.waitFor({ state: 'visible', timeout: 5000 });

        // Click Contractor button
        await helper.clickButton("Contractor");

        // Verify header is displayed
        const contractorColumnHeader = this.page.locator('[automation-column-header="Contractor"]');
        await contractorColumnHeader.waitFor({ state: 'visible', timeout: 5000 });
    }

    /*
    ************************************
    * Create Contractor Work Order
    ************************************
    */
    async createContractorWO(desc: string, assetNumber: string, vendor: string): Promise<void> {
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

        // Wait for the CreateWorkOrder dialog to close
        const createDialogElement = this.page.locator('[automation-dialog="CreateWorkOrder"]');
        await createDialogElement.waitFor({ state: 'hidden', timeout: 10000 });

        // Wait for the page to load after creating the Work Order
        await this.page.waitForLoadState('networkidle');
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
    async setContractorDueStartDate(daysAhead: number): Promise<string> {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);

        const year = futureDate.getFullYear();
        const month = String(futureDate.getMonth() + 1).padStart(2, '0');
        const day = String(futureDate.getDate()).padStart(2, '0');
        const hours = String(futureDate.getHours()).padStart(2, '0');
        const minutes = String(futureDate.getMinutes()).padStart(2, '0');

        const dateOnly = `${year}-${month}-${day}`;
        const timeOnly = `${hours}:${minutes}`;

        await this.page.locator('[automation-input="DueStart_date"]').fill(dateOnly);
        await this.page.locator('[automation-input="DueStart_time"]').fill(timeOnly);

        return `${dateOnly}T${timeOnly}`;
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
    * Set Quote Number
    **********************************
    */
    async setQuoteNumber(quoteNumber: string): Promise<string> {
        await helper.enterValue("QuoteNo", quoteNumber)
        await this.page.waitForTimeout(1000);
        return quoteNumber;
    }

    /*
    **********************************
    * Set Quote $Inc. Tax Amount
    **********************************
    */
    async setQuoteAmount(quoteAmount: string): Promise<string> {
        await helper.enterValue("Quote$Inc.Tax", quoteAmount)
        await this.page.waitForTimeout(1000);
        return quoteAmount;
    }

    /*
    ***************************
    * Click Back button
    ***************************
    */
    async clickBackBtn(): Promise<void> {
        await helper.closePage();
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
        //await this.page.waitForTimeout(1000);
        // Wait for page to load after navigation
        await this.page.waitForLoadState('networkidle');        

    }
    
    /*
    **********************************
    * Click PO hyperlink
    **********************************
    */
    async clickPOHyperlink(): Promise<void> {
        // Locate the input field by automation-input name and click it to open the PO details
        const poInput = this.page.locator('[automation-input="PurchaseOrderNo"]');
        await poInput.click();

        // After clicking the hyperlink we expect the Purchase Order details to load.
        // Wait for the PO header to appear so subsequent verifications can operate on the correct page.
        const poHeader = this.page.locator('[automation-header="PurchaseOrderHeader"]');
        await poHeader.waitFor({ state: 'visible', timeout: 10000 });

        // Give UI a moment to stabilise after navigation.
        // Note: Details tab opening is handled by verification methods if needed.
        await this.page.waitForTimeout(500);
    }

    /*
    ************************************************
    * Click Contractor Invoice Entry - Submit button
    ************************************************
    */
      async clickInvoiceEntrySubmitBtn(): Promise<void> {
        await helper.clickButtonInDialog("ContractorInvoiceEntry", "Submit");
        //await this.page.waitForTimeout(1000);
        //aWait for page to load after navigation
        await this.page.waitForLoadState('networkidle');
    } 

    /*
    ************************************************
    * Click Contractor Invoice Entry - Approve button
    ************************************************
    */
      async clickInvoiceEntryApproveBtn(): Promise<void> {
        await helper.clickButtonInDialog("ContractorInvoiceEntry", "Approve");
        //await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('networkidle');
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
        //await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('networkidle');
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
        // Wait for element visibility using smart wait
        // Verify header is displayed
        const contractorColumnHeader = this.page.locator('[automation-column-header="Contractor"]');
        await contractorColumnHeader.waitFor({ state: 'visible', timeout: 5000 });

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