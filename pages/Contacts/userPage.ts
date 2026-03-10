import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class UsersPage {
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
        await this.openUsersListing();
    }

    async openUsersListing(): Promise<void> {
            // Wait for the Stores button to become visible
        await this.page.waitForSelector('[automation-button="NavItemSettings"]', { state: 'visible', timeout: 5000 });        
        // Click on Stores button to open the Stores menu
        await helper.clickButton("NavItemSettings");
        await this.page.waitForSelector('[automation-button="Users"]', { state: 'visible', timeout: 5000 });
        await helper.clickButton('Users');
        await this.assertUsersListingOpened();
    }

    /**
     * Asserts that the Users listing page is opened by checking the header.
     */
    async assertUsersListingOpened(): Promise<void> {
        await helper.checkHeader('UsersListingHeader');

        // Verify the UsersListingHeader text reads "Users Listing"
        const header = this.page.locator('[automation-header="UsersListingHeader"]');
        await expect(header).toHaveText("Users Listing", { timeout: 5000 });        
    }
}