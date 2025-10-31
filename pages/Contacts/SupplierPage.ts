import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class SupplierPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*
    ************************************
    * Open Supplier Listing
    * - Ensures the Settings / Contacts nav section is open
    * - Clicks Supplier to open its listing
    ************************************
    */

    async openSupplierListing(): Promise<void> {
        try {
            // Try the default navigation path first
            const contactsButton = this.page.locator('[automation-button="Contacts"]');
            if (!(await contactsButton.isVisible().catch(() => false))) {
                await helper.clickButton('NavItemSettings');
                await this.page.waitForSelector('[automation-button="Contacts"]', { state: 'visible', timeout: 5000 });
            }

            const supplierButton = this.page.locator('[automation-button="Supplier"]');
            if (!(await supplierButton.isVisible().catch(() => false))) {
                await helper.clickButton('Contacts');
                await this.page.waitForSelector('[automation-button="Supplier"]', { state: 'visible', timeout: 5000 });
            }

            await helper.clickButton('Supplier');
            await this.assertSupplierListingOpened();
        } catch (err) {
            console.warn("Default navigation failed, trying fallback via NavItemStores...");

            // Fallback navigation path
            try {
                await helper.clickButton('NavItemStores');
                await this.page.waitForSelector('[automation-button="Suppliers"]', { state: 'visible', timeout: 5000 });
                await helper.clickButton('Suppliers');
                await this.assertSupplierListingOpened();
            } catch (fallbackErr) {
                throw new Error(`openSupplierListing failed: ${String(fallbackErr)}`);
            }
        }
    }
   
    /*
    ************************************
    * Create New Supplier
    ************************************
    */
    async createSupplier(companyCode: string, companyName:string,): Promise<void> {
        const newSupplierButton = this.page.locator('[automation-button="NewSupplier"]');
        if (!(await newSupplierButton.isVisible().catch(() => false))) {
            await this.openSupplierListing(); // This now includes fallback logic
        }

        await helper.clickButton('NewSupplier');
        await helper.enterValueInFilterDialog('CreateContact', 'CompanyCode', companyCode);
        await helper.enterValueInFilterDialog('CreateContact', 'CompanyName', companyName);
        await helper.clickButton("Create");
        await this.page.waitForTimeout(1000);
        await helper.clickButton('Back');
    }
   
    /**
     * Asserts that the Supplier listing page is opened by checking the header.
     */
    async assertSupplierListingOpened(): Promise<void> {
        await helper.checkHeader('ContactsListingHeader');

        // Verify the ContactsListingHeader text reads "Supplier Listing"
        const header = this.page.locator('[automation-header="ContactsListingHeader"]');
        await expect(header).toHaveText("Suppliers Listing", { timeout: 5000 });        
    }

    /**
     * Verify that the Supplier is created and exists in the listing.
     */
    async verifySupplierExist(): Promise<void> {
        await helper.clickButton("Refresh");
        await this.page.waitForTimeout(1000);
 
        const supplierCode = "SUPP001";
        const selector = `[automation-grid="ContactListingGrid"] >> text=${supplierCode}`;

        // Check if the supplier exists in the grid
        const supplierExists = await this.page.locator(selector).isVisible();

        if (supplierExists) {
            await helper.selectRowByFieldName("ContactListingGrid", "Code|FirstName", supplierCode);
            console.log(`Supplier ${supplierCode} found and selected.`);
        } else {
            throw new Error(`Supplier ${supplierCode} not found in ContactListingGrid.`);
        }
    }
}