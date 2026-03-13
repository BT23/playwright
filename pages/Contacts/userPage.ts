import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

const DEFAULT_TIMEOUT = 10_000;

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
        // Open Settings
        const settingsBtn = this.page.locator('[automation-button="NavItemSettings"]');
        await expect(settingsBtn, 'Settings button should be visible').toBeVisible({ timeout: DEFAULT_TIMEOUT });
        await settingsBtn.click({ timeout: DEFAULT_TIMEOUT });

        const usersItem = this.page
        .locator('div[automation-button="Users"]')
        .filter({ has: this.page.locator('[automation-label="lblUsers"]') }); // ties it to the proper label

        await expect(usersItem, 'Users menu item should be visible').toBeVisible({ timeout: DEFAULT_TIMEOUT });
        await usersItem.click({ timeout: DEFAULT_TIMEOUT });

        await this.assertUsersListingOpened();
    }

   /**
    * Create new Contractor User
    */

    async createNewUser(firstname: string, lastname: string, username: string, type: string, password: string, confirmPassword: string): Promise<void> {
        await helper.clickButton('New')
        await this.page.waitForTimeout(1000);

        const createUserHeader = this.page.locator('[automation-header="CreateUser"]');
        await createUserHeader.waitFor({ state: 'visible', timeout: 5000 });

         // Fill in the asset details from the createAssetData.json file
        await helper.enterValueInDialog("CreateUser", "FirstName", firstname);
        await helper.enterValueInDialog("CreateUser", "LastName", lastname);
        await helper.enterValueInDialog("CreateUser", "UserName", username);
        await helper.enterValueInDialog("CreateUser", "Type", type);
        await helper.selectFirstListItem();
        await helper.enterValueInDialog("CreateUser", "Password", password);
        await helper.enterValueInDialog("CreateUser", "ConfirmPassword", confirmPassword);
        await helper.clickButton("Create");

    }   

   /**
    * Click Back button to return to previous page
    */    
    async clickBackBtn(): Promise<void> {
        await helper.closePage();
        await this.page.waitForTimeout(1000);
    }

   /**
    * Asserts that the Users listing page is opened by checking the header.
    */
    async assertUsersListingOpened(): Promise<void> {
        await helper.checkHeader('UsersListingHeader');
        const header = this.page.locator('[automation-header="UsersListingHeader"]');
        await expect(header).toBeVisible({ timeout: DEFAULT_TIMEOUT });
        await expect(header).toHaveText('Users Listing', { timeout: DEFAULT_TIMEOUT });
    }

   /**
    * Asserts that the Users listing page is opened by checking the header.
    */
    async verifytUserCreated(username: string): Promise<void> {
        const grid = this.page.locator('[automation-grid="UserListingGrid"]').first();
        await expect(grid, 'User listing grid should be visible').toBeVisible();

        // Assert the target cell exists (explicit verification)
        const userCell = grid
            .locator('[automation-row]')
            .locator(`[automation-col="UserName"]`)
            .filter({ hasText: username });

        // If you want exact match instead of substring, use the regex version below
        await expect(userCell, `Expected a UserName cell containing "${username}"`).toHaveCount(1);

        // Reuse your existing helper (unchanged)
        await helper.selectRowByFieldName('UserListingGrid', 'UserName', username);

    }    
}