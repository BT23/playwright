import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class HistoryPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*
    *********************
    * Open History Module
    *********************
    */

    async openHistoryModule(): Promise<void> {
        // Check if the "History" button is visible
        const historyButton = this.page.locator('[automation-button="History"]');
        if (!(await historyButton.isVisible())) {
            await helper.addModuleToMenu("History");
            await this.page.waitForTimeout(1000);
        }

        await helper.clickButton("History");
        await helper.checkHeader("WorkOrderHistoryListingHeader");
    }

    /*
    **********************
    * Create Post Entry WO
    **********************
    */
    async createPostEntryWO(historyDesc:string, assetNumber: string): Promise<void> {
        await this.openHistoryModule();

        await helper.clickButton("PostEntry");
        await this.page.waitForTimeout(1000);

        await helper.enterValueInDialog("PostEntry","HistoryDescription",historyDesc);
        await this.page.waitForTimeout(1000);

        const shortAssetNumber = assetNumber.split(' ')[0];

        await helper.enterValueInDialog("PostEntry", "Asset", shortAssetNumber);

        await this.page.waitForTimeout(1000);

        // Select the first item from the Asset list
        await helper.selectFirstListItem();        

        // Click the Create button to save the new Work Order
        await helper.clickButton("Create");

        await this.page.waitForTimeout(1000);
    }

    /*
    ***************************
    * Open Specified Closed WO
    ***************************
    */
    async openClosedWOByWONumber(woNumber: string): Promise<void> {
        await helper.selectRowByFieldName("WorkOrderHistoryListingGrid","W/ONo", woNumber);
        await this.page.waitForTimeout(1000);
        await helper.clickButton("Details");
        await this.page.waitForTimeout(1000);
    }
}