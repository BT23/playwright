import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';


export class ContractorPortalPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*
    ***************************************
    * Verify Contractor User Portal showing
    ***************************************
    */
    async verifyContractorUserPortalHeader(): Promise<void> {
    await this.page.waitForSelector('[control-name="lblContractorUserPortal"]', { state: 'visible', timeout: 10000 });
    await expect(this.page.locator('[control-name="lblContractorUserPortal"]')).toBeVisible();
    }

    /*
    ******************************************
    * Verify Specific Contractor WO PO appears
    ******************************************
    */
    async verifyPONumberNotInContractorPortalListing(poNumber: string): Promise<void> {
        // Locate the grid and all rows
        const grid = this.page.locator('[automation-grid="ContractorPortalListingGrid"]');
        const rows = grid.locator('[automation-row]');
        const count = await rows.count();

        let found = false;

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const poCell = row.locator('[automation-col="PurchaseOrderNo"]');
            const cellText = (await poCell.textContent())?.trim();
            if (cellText === poNumber) {
                found = true;
                break;
            }
        }

        // The test passes if the PO number is NOT found
        expect(found).toBe(false);
    }  
}