import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class PmPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*
    *****************
    * Open PM Module
    *****************
    */
    async openPMModule(): Promise<void> {
        // Check if the "History" button is visible
        const pmButton = this.page.locator('[automation-button="PreventativeMaintenance"]');
        if (!(await pmButton.isVisible())) {
            await helper.addModuleToMenu("PreventativeMaintenance");
            await this.page.waitForTimeout(1000);
        }
        
        // Click on the Work Orders button to open the Work Order module
        await helper.clickButton("PreventativeMaintenance");

        // Verify that the Work Order Listing header is displayed
        await helper.checkHeader("PreventativeMaintenanceListingHeader");
    }
}