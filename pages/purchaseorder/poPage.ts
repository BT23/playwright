import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

import { writeFileSync, readFileSync } from 'fs';
import path from 'path';



export class PoPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    async goto() {
        await this.openStoresMenu();
        await this.openPOModule();
    }

    /*
    ************************************
    * Open Purchase Order Listing
    ************************************
    */
    async openStoresMenu(): Promise<void> {
        // Wait for the Purchasing button to become visible
        await this.page.waitForSelector('[automation-button="NavItemStores"]', { state: 'visible', timeout: 5000 });        
        // Click on Stores button to open the Stores menu
        await helper.clickButton("NavItemStores");
    }    
    
    async openPOModule(): Promise<void> {
        // Wait for the Purchasing button to become visible
        await this.page.waitForSelector('[automation-button="Purchasing"]', { state: 'visible', timeout: 5000 });

        // Click on Purchasing button to open the PO Listing
        await helper.clickButton("Purchasing");

        // Wait for the PO Listing header to appear
        await this.page.waitForSelector('[automation-header="PurchaseOrderListingHeader"] span', { state: 'visible', timeout: 5000 });
    }

    /***************************
    * Create New Purchase Order
    ***************************
    */
  
    async createPO(poSupplier: string, filePath?: string): Promise<string> {
        // Click the New button to create a new Purchase Order
        await helper.clickButton("New");

        // Wait until the PO Header is visible before clicking
        const createPOHeader = this.page.locator('[automation-header="CreatePurchaseOrder"]');
        await createPOHeader.waitFor({ state: 'visible', timeout: 5000 });    

        // Enter the supplier short name in the dialog/list
        const supplierShortName = poSupplier.split(' ')[0].substring(0, 2);
        await helper.enterEllipseValueInDialog("CreatePurchaseOrder", "Supplier", supplierShortName);      
        await this.page.waitForTimeout(1000);

        // Click the Create button to save the new Purchase Order
        await helper.clickButton("Create");

        // Wait until the PO Header is visible before clicking
        const poHeader = this.page.locator('[automation-header="PurchaseOrderHeader"]');
        await poHeader.waitFor({ state: 'visible', timeout: 5000 });        

        await helper.enterValue("SpecialInstructions", "Automation Testing - Create PO");
        await this.page.waitForTimeout(1000);

        const poNumber = await helper.getFieldValue("PurchaseOrderNo");
        console.log(`Created PO Number: ${poNumber}`);

        if (filePath) {
            // Save
            writeFileSync(filePath, JSON.stringify({ poNumber }, null, 2));
        }
        return poNumber;

    }

    /***************************
    * Add Catalogue Item to PO
    ***************************
    */
  
    async addPOItem(SupplierStockNumber: string, Quantity:string): Promise<void> {
        // Wait until the PO Header is visible before clicking
        const poHeader = this.page.locator('[automation-header="PurchaseOrderHeader"]');
        await poHeader.waitFor({ state: 'visible', timeout: 5000 });

        // Wait until the ItemsTab button is visible before clicking
        const itemsTab = this.page.locator('[automation-tab="ItemsTab"]');
        await itemsTab.waitFor({ state: 'visible', timeout: 5000 });

        // Click the Items tab
        this.clickPOItemTab();

        // Wait until the Items tab content is visible
        const itemsTabContent = this.page.locator('[automation-tab="ItemsTab"]'); // Adjust selector if needed
        await itemsTabContent.waitFor({ state: 'visible', timeout: 5000 });

        //Add Item line
        await helper.clickButton("Add");

        // Enter the supplier short name in the dialog/list
        const newRow = await helper.selectLastRow("ItemsTabGrid");
        const stockNumberShortName = SupplierStockNumber.split(' ')[0].substring(0, 2);     
        await helper.enterValueInCell(newRow, "SupplierStockNumber", stockNumberShortName);
        await helper.selectFirstListItem();
        await this.page.waitForTimeout(1000);
        await helper.enterValueInCell(newRow, "Quantity", Quantity);
        await this.page.waitForTimeout(1000);
    }

    /*
    ***************************
    * Select Specificed PO
    ***************************
    */
    async selectSpecificedPO(poNumber: string): Promise<void> {
        await helper.selectRowByFieldName("PurchaseOrderListingGrid","P/ONumber", poNumber.trim());
        await this.page.waitForTimeout(1000);
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
    * Click Back button
    ***************************
    */
    async clickBackBtn(): Promise<void> {
        await helper.closePage();
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
    * Click PO Item tab
    ***************************
    */
    async clickPOItemTab(): Promise<void> {
        await helper.selectTab("ItemsTab");
        await this.page.waitForTimeout(1000);
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
    ***************************
    * Listing Filter methods
    ***************************
    */
    async openListingFilter(): Promise<void> {
        const filterButton = this.page.locator('[automation-button="listingFilter"]');
        await filterButton.waitFor({ state: 'visible', timeout: 5000 });
        await filterButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500); // Let layout settle
        await helper.clickButton("listingFilter");
        await this.page.waitForTimeout(1000);
    }

    async closeListingFilter(): Promise<void> {
        const filterButton = this.page.locator('[automation-button="listingFilter"]');
        await filterButton.waitFor({ state: 'visible', timeout: 5000 });
        await filterButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500); // Let layout settle
        await helper.clickButton("listingFilter");
        await this.page.waitForTimeout(1000);
    }
    
    async enabledFilterPOStatusAllReceived(): Promise<void> {    
        await helper.selectDropDown("PurchaseOrderStatus");
        await this.page.waitForTimeout(1000);
        await helper.selectListItemByIndex(0); // All Received        
        await this.page.waitForTimeout(1000);
        await helper.clickButton("Apply");
    }

    /*
    ***************************
    * Verification methods
    ***************************
    */

    /*
    ****************************************
    * Verify PO Due Start Date (Details tab)
    ****************************************
    */
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

    /*
    **************************************
    * Verify PO Quote Number (Details tab)
    **************************************
    */
    async verifyPOQuoteNumber(expectedQuoteNumber: string): Promise<void> {
        // Wait for the QuoteNo field to be visible
        const quoteNoField = this.page.locator('[automation-input="QuoteNo"]');
        await quoteNoField.waitFor({ state: 'visible', timeout: 10000 });

        // Get the value from the QuoteNo field
        const actualQuoteNo = await quoteNoField.inputValue();

        // Assert that QuoteNo matches the expected value from the JSON file
        expect(actualQuoteNo.trim()).toBe(expectedQuoteNumber.trim());
    }

    /*
    *********************************************
    * Verify PO Supplier Stock Number (Items tab)
    *********************************************
    */

    /**
     * Verifies that all specified cell values in the first row of the ItemsTabGrid match the expected values.
     *
     * This method is a wrapper around the generic row verification logic, allowing tests to pass in a set of
     * expected column-value pairs for validation. It simplifies test code by abstracting row selection and
     * cell-by-cell comparison.
     *
     * @param expectedValues - An object where keys are column names (matching `automation-col` attributes)
     *                         and values are the expected cell contents.
     *
    */
    async verifyPOItemRow(expectedValues: Record<string, string>): Promise<void> {
    const firstRow = await helper.selectFirstRow("ItemsTabGrid");
    await helper.verifyRowCellValues(firstRow, expectedValues);
    }

    /*
    **************************************************************
    * Verify PO Contractor Invoice Transactions (Transactions tab)
    * 
    * This method verifies that the Transactions tab contains both
    * "Receipt" and "Invoice Match" entries in the Action column.
    **************************************************************
    */
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

    /*
    **************************************************************
    * Verify PO Contractor Invoice Transactions (Transactions tab)
    * 
    * This method verifies that the Transactions tab contains both
    * "Receipt" and "Invoice Match" entries in the Action column.
    **************************************************************
    */
    async verifyPOReceiptActionTransactions(): Promise<void> {
        // Select the row with "Receipt" in the Action column
        await helper.selectRowByFieldName("TransactionsTabGrid", "Action", "Receipt");

        // Get all rows in the TransactionsTabGrid
        const grid = this.page.locator('[automation-grid="TransactionsTabGrid"]');
        const rows = grid.locator('[automation-row]');
        const count = await rows.count();

        let foundReceipt = false;

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const actionCell = row.locator('[automation-col="Action"]');
            const cellText = (await actionCell.textContent())?.trim();
            if (cellText === "Receipt") foundReceipt = true;
        }

        expect(foundReceipt).toBe(true);
    }

}