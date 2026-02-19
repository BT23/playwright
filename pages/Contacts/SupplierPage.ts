import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class SupplierPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*************************************
    * Navigate to Supplier Listing
    ************************************
    */
    async goto() {
        await this.openSupplierListing();
    }

    /*
    ************************************
    * Open Supplier Listing
    * - Ensures the Settings / Contacts nav section is open
    * - Clicks Supplier to open its listing
    ************************************
    */

    async openSupplierListing(): Promise<void> {
        // Wait for the Stores button to become visible
        await this.page.waitForSelector('[automation-button="NavItemStores"]', { state: 'visible', timeout: 5000 });        
        // Click on Stores button to open the Stores menu
        await helper.clickButton("NavItemStores");
        await this.page.waitForSelector('[automation-button="Suppliers"]', { state: 'visible', timeout: 5000 });
        await helper.clickButton('Suppliers');
        await this.assertSupplierListingOpened();
        /*
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
        */
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

    /**
     * Asserts that the Supplier listing page is opened by checking the header.
     */
    async assertSupplierListingOpened(): Promise<void> {
        await helper.checkHeader('SuppliersListingHeader');

        // Verify the SuppliersListingHeader text reads "Suppliers Listing"
        const header = this.page.locator('[automation-header="SuppliersListingHeader"]');
        await expect(header).toHaveText("Suppliers Listing", { timeout: 5000 });        
    }

    /**
     * Verify that the Supplier is created and exists in the listing.
     */
    async verifySupplierExist(companyCode: string): Promise<void> {
        await helper.clickButton("Refresh");
        await this.page.waitForTimeout(1000);
 

        const selector = `[automation-grid="ContactListingGrid"] >> text=${companyCode}`;

        // Check if the supplier exists in the grid
        const supplierExists = await this.page.locator(selector).isVisible();

        if (supplierExists) {
            await helper.selectRowByFieldName("ContactListingGrid", "Code|FirstName", companyCode);
            console.log(`Supplier ${companyCode} found and selected.`);
        } else {
            throw new Error(`Supplier ${companyCode} not found in ContactListingGrid.`);
        }
    }
}