import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';


export class PoPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*
    ************************************
    * Open Purchase Order Listing
    ************************************
    */
    async openPOModule(): Promise<void> {
        // Click on Stores button to open the Stores menu
        await helper.clickButton("Stores");

        // Click on Stores button to open the Stores menu
        await helper.clickButton("Purchasing");
        
        // Verify that the Work Order Listing header is displayed
        await helper.checkHeader("PurchaseOrderListingHeader");
    
        await this.page.waitForTimeout(1000);
    }

    /*
    ***************************
    * Create New Purchase Order
    ***************************
    */
    async createPurchaseOrder(poSupplier: string): Promise<void> {

        await this.openPOModule();
        await helper.clickButton("New");

        // Enter the supplier short name in the dialog/list
        const supplierShortName = poSupplier.split(' ')[0];
        await helper.enterValueInDialog("CreatePurchaseOrder", "Supplier", supplierShortName);

        // Select the first item from the supplier list
        await helper.selectFirstListItem();

        await this.page.waitForTimeout(1000);

        // Click the Create button to save the new Purchase Order
        await helper.clickButton("Create");
        await this.page.waitForTimeout(1000);

        await helper.closePage();
    }

    /*
    ***************************
    * Click PO Details Button
    ***************************
    */
    async clickPODetailsBtn(): Promise<void> {
        await helper.clickButton("Details");
        await this.page.waitForTimeout(1000);
    }

    /*
    ***************************
    * Click PO Approve button
    ***************************
    */
    async clickPOApproveBtn(): Promise<void> {
        const approveBtn = this.page.locator('[automation-button="Approve"]');
        if (await approveBtn.isVisible() && await approveBtn.isEnabled()) {
            await approveBtn.click();
            await this.page.waitForTimeout(1000);
            await helper.clickButtonInDialog("PurchaseOrderApproval", "Ok");
        } else {
            console.log("Is Approving used for Purchasing option is off");
        }
    }

    /*
    ***************************
    * Click PO Transactions Tab
    ***************************
    */
    async clickPOTransactionsTab(): Promise<void> {
        await helper.selectTab("TransactionsTab");
        await this.page.waitForTimeout(1000);
    }

    /*
    ******************
    * Close PO Details
    ******************
    */
    async closePODetails(): Promise<void> {
        await helper.closePage();
        await this.page.waitForTimeout(1000);
    } 

    async verifyPODueStartDate(expectedDueStart: string): Promise<void> {
        // Wait for the DateDue field to be visible
        const dateDueField = this.page.locator('[automation-input="DateDue"]');
        await dateDueField.waitFor({ state: 'visible', timeout: 10000 });

        // Get the value from the DateDue field
        const actualDateDue = await dateDueField.inputValue();

        // Assert that DateDue matches the expected DueStart value
        // Compare only the date part (YYYY-MM-DD)
        expect(actualDateDue.slice(0, 10)).toBe(expectedDueStart.slice(0, 10));
    }

    async verifyPOQuoteNumber(expectedQuoteNumber: string): Promise<void> {
        // Wait for the QuoteNo field to be visible
        const quoteNoField = this.page.locator('[automation-input="QuoteNo"]');
        await quoteNoField.waitFor({ state: 'visible', timeout: 10000 });

        // Get the value from the QuoteNo field
        const actualQuoteNo = await quoteNoField.inputValue();

        // Assert that QuoteNo matches the expected value from the JSON file
        expect(actualQuoteNo.trim()).toBe(expectedQuoteNumber.trim());
    }

    async verifyPOContractorInvoiceTransactions(): Promise<void> {
        // Select the row with "Receipt" in the Action column
        await helper.selectRowByFieldName("TransactionsTabGrid", "Action", "Receipt");

        // Get all rows in the TransactionsTabGrid
        const grid = this.page.locator('[automation-grid="TransactionsTabGrid"]');
        const rows = grid.locator('[automation-row]');
        const count = await rows.count();

        let foundReceipt = false;
        let foundInvoiceMatch = false;

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const actionCell = row.locator('[automation-col="Action"]');
            const cellText = (await actionCell.textContent())?.trim();
            if (cellText === "Receipt") foundReceipt = true;
            if (cellText === "Invoice Match") foundInvoiceMatch = true;
        }

        expect(foundReceipt).toBe(true);
        expect(foundInvoiceMatch).toBe(true);
    }   
}