import { expect, Locator, Page } from '@playwright/test';
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
    * Enter PO Supplier on Create PO Dialog
    ***************************
    */
  
    async enterPOSupplier(poSupplier: string): Promise<void> {
        // Wait until the PO Header is visible before clicking
        const createPOHeader = this.page.locator('[automation-header="CreatePurchaseOrder"]');
        await createPOHeader.waitFor({ state: 'visible', timeout: 5000 });    

        // Enter the supplier short name in the dialog/list
        const supplierShortName = poSupplier.split(' ')[0].substring(0, 2);
        await helper.enterEllipseValueInDialog("CreatePurchaseOrder", "Supplier", supplierShortName);      
        await this.page.waitForTimeout(1000);
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
        await this.clickPOItemTab();

        // Wait until the Items tab content is visible
        const itemsTabContent = this.page.locator('[automation-tab="ItemsTab"]');
        await itemsTabContent.waitFor({ state: 'visible', timeout: 5000 });

        // Add item line
        await helper.clickButton("Add");
        await this.page.waitForTimeout(1000);

        const newRow = await helper.selectLastRow("ItemsTabGrid");
        const stockNumberShortName = SupplierStockNumber.split(' ')[0].substring(0, 2);

        await this.enterGridCellValue(newRow, "SupplierStockNumber", stockNumberShortName);
        await helper.selectFirstListItem();
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(1000);
        await this.enterGridCellValue(newRow, "Quantity", Quantity);
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Tab');
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
    * Click Create button on Create PO Dialog
    ***************************
    */
    async clickCreateBtn(): Promise<String> {
        await helper.clickButton("Create");
        await this.page.waitForTimeout(1000);

        // Wait until the PO Header is visible before clicking
        const poHeader = this.page.locator('[automation-header="PurchaseOrderHeader"]');
        await poHeader.waitFor({ state: 'visible', timeout: 5000 });        

        const poNumber = await helper.getFieldValue("PurchaseOrderNo");
        console.log(`Created PO Number: ${poNumber}`);

        return poNumber;        
    }

    /*
    ***************************
    * Click PO Approve button
    ***************************
    */
    async clickPOApproveBtn(): Promise<void> {
        const approveBtn = this.page.locator('[automation-button="Approve"]');

        // 1️⃣ Not visible → skip
        if (!(await approveBtn.isVisible())) {
            console.log("⚠️ Approve button not visible, skipping approval step");
            return;
        }

        // 2️⃣ Check if truly clickable using trial click
        try {
            await approveBtn.click({ trial: true, timeout: 3000 });
        } catch {
            console.log("⚠️ Approve button visible but NOT clickable, skipping approval step");
            return;
        }

        // 3️⃣ If we reach here → button is really clickable
        console.log("✅ Approve button is clickable, proceeding with click");

        await approveBtn.click({ timeout: 10000 });

        // 4️⃣ Only handle dialog if it appears. Use waitFor with try/catch
        //    because `locator.isVisible()` does not accept a timeout option.
        const dialog = this.page.locator('[automation-dialog="PurchaseOrderApproval"]');
        try {
            await dialog.waitFor({ state: 'visible', timeout: 5000 });
            console.log("✅ Approval dialog appeared, clicking Ok");
            await helper.clickButtonInDialog("PurchaseOrderApproval", "Ok");
        } catch (e) {
            console.log("ℹ️ Approval dialog did not appear");
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
        // Ensure we're on the PO details page before interacting with fields.
        const poHeader = this.page.locator('[automation-header="PurchaseOrderHeader"]');
        await poHeader.waitFor({ state: 'visible', timeout: 10000 });

        // Wait for the DateDue field to be visible
        const dateDueField = this.page.locator('[automation-input="DateDue_date"]');
        await dateDueField.waitFor({ state: 'visible', timeout: 10000 });

        // Sometimes a navigation is still settling, wait for network idle just in case
        await this.page.waitForLoadState('networkidle');

        // Get the value from the DateDue field
        const actualDateDue = await dateDueField.inputValue();

        // Assert that DateDue matches the expected DueStart value
        // Compare only the date part (YYYY-MM-DD)
        expect(actualDateDue.slice(0, 10)).toBe(expectedDueStart.slice(0, 10));
        console.log("📝 Verified Due Start Date in PO: " + actualDateDue.slice(0, 10));
    }

    /*
    **************************************
    * Verify PO Quote Number (Details tab)
    **************************************
    */
    async verifyPOQuoteNumber(expectedQuoteNumber: string): Promise<void> {
        // Ensure we're on the PO details page.  The header should be present.
        const poHeader = this.page.locator('[automation-header="PurchaseOrderHeader"]');
        await poHeader.waitFor({ state: 'visible', timeout: 10000 });

        // Wait for the QuoteNo field to be visible
        const quoteNoField = this.page.locator('[automation-input="QuoteNo"]');
        await quoteNoField.waitFor({ state: 'visible', timeout: 10000 });

        // Get the value from the QuoteNo field
        const actualQuoteNo = await quoteNoField.inputValue();

        // Assert that QuoteNo matches the expected value from the JSON file
        expect(actualQuoteNo.trim()).toBe(expectedQuoteNumber.trim());
        console.log("📝 Verified Quote Number in PO: " + actualQuoteNo.trim());        
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
        await firstRow.waitFor({ state: 'visible', timeout: 10000 });

        const deadline = Date.now() + 15000;
        let lastMismatch: string[] = [];

        while (Date.now() < deadline) {
            const mismatches: string[] = [];

            for (const [columnName, expectedValue] of Object.entries(expectedValues)) {
                const actualValue = await this.getGridCellValue(firstRow, columnName);
                const actualNormalized = this.normalizeComparableValue(actualValue);
                const expectedNormalized = this.normalizeComparableValue(expectedValue);

                if (actualNormalized.numeric !== undefined && expectedNormalized.numeric !== undefined) {
                    if (Math.abs(actualNormalized.numeric - expectedNormalized.numeric) > 0.0001) {
                        mismatches.push(`❌ Column "${columnName}": Expected ${expectedValue}, but got ${actualValue}`);
                    }
                } else if (actualNormalized.text !== expectedNormalized.text) {
                    mismatches.push(`❌ Column "${columnName}": Expected "${expectedValue}", but got "${actualValue}"`);
                }
            }

            if (mismatches.length === 0) {
                return;
            }

            lastMismatch = mismatches;
            await this.page.waitForTimeout(1000);
        }

        throw new Error(`PO Item Cell Verification Failed:\n${lastMismatch.join('\n')}`);
    }

    private async enterGridCellValue(row: Locator, columnName: string, value: string, shouldPressTab = false): Promise<void> {
        const cell = row.locator(`[automation-col="${columnName}"]`).first();
        await cell.waitFor({ state: 'visible', timeout: 10000 });
        await cell.scrollIntoViewIfNeeded();

        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                await cell.click({ force: true });
                await this.page.waitForTimeout(500);
                await helper.enterValue(columnName, value, shouldPressTab);
                return;
            } catch (error) {
                if (attempt === 2) {
                    throw error;
                }
                await this.page.waitForTimeout(1000);
            }
        }
    }

    private async getGridCellValue(row: Locator, columnName: string): Promise<string> {
        const cell = row.locator(`[automation-col="${columnName}"]`).first();
        await cell.waitFor({ state: 'visible', timeout: 10000 });
        return (await cell.textContent())?.trim() ?? '';
    }

    private normalizeComparableValue(value: string): { text: string; numeric?: number } {
        const raw = (value ?? '').trim();
        const noCurrency = raw.replace(/[$£€₹¥₩₽¢]/g, '').replace(/\u00A0/g, ' ').trim();
        const noSeparators = noCurrency.replace(/,/g, '').trim();
        const match = noSeparators.match(/-?\d+(?:\.\d+)?/);
        const numeric = match ? parseFloat(match[0]) : undefined;
        return { text: noSeparators.toLowerCase(), numeric };
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