import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class PmPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }
    async goto() {
        await this.openPMModule();
    }
    /*
    *****************
    * Open PM Module
    *****************
    */
    async openPMModule(): Promise<void> {
        // Wait for element visibility using smart wait
        const navButton = this.page.locator('[automation-button="NavItemPreventativeMaintenance"]');
        await navButton.waitFor({ state: 'visible', timeout: 5000 });
        
        // Click on the Work Orders button to open the Work Order module
        await helper.clickButton("NavItemPreventativeMaintenance");

        // Wait for page to load after navigation
        await this.page.waitForLoadState('networkidle');

        // Verify header is displayed
        const header = this.page.locator('[automation-header="PreventativeMaintenanceListingHeader"] span');
        await header.waitFor({ state: 'visible', timeout: 5000 });
    }
}