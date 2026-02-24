import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class ReadingPage {
    static openReadingsModule() {
        throw new Error('Method not implemented.');
    }
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    async goto() {
        await this.openReadingsModule();
    }

    /*
    *********************
    * Open Readings Module
    *********************
    */

    async openReadingsModule(): Promise<void> {
        // Wait for element visibility using smart wait
        const navButton = this.page.locator('[automation-button="NavItemReadings"]');
        await navButton.waitFor({ state: 'visible', timeout: 5000 });

        await helper.clickButton("NavItemReadings");

        // Wait for page to load after navigation
        await this.page.waitForLoadState('networkidle');
    }

    /*
    ***********************************************
    * Locate specific Asset Reading and add reading
    ***********************************************
    */
    async locateAndAddAssetReading(assetNumber: string, readingValue: string): Promise<void> {
        const woHeader = this.page.locator('[automation-grid="AssetReadingListingGrid"]');
        await woHeader.waitFor({ state: 'visible', timeout: 5000 });
         
        await helper.selectRowByFieldName("AssetReadingListingGrid","AssetNo", assetNumber);
        await helper.clickButton("AddReading");

        const createAssetHeader = this.page.locator('[automation-header="AddReading"]');
        await createAssetHeader.waitFor({ state: 'visible', timeout: 5000 });

        await helper.enterValueInDialog("AddReading", "CurrentReading", readingValue);
        await this.page.waitForTimeout(1000);

        await helper.clickButton("Process");
    }

    /*
    **************************************************************
    * Verify reading is added successfully
    * 
    * This method verifies that the Readings table contains a new entry with the expected reading value.
    * It checks for the presence of the reading value in the appropriate column.
    **************************************************************
    */
    async verifyReadingAddedSuccessfully(assetNumber: string, expectedReadingValue: string): Promise<void> {
        await helper.selectRowByFieldName("AssetReadingListingGrid","AssetNo", assetNumber);

        await helper.selectTab("ReadingsTab");

        // Select the row with "Receipt" in the Action column
        await helper.selectRowByFieldName("ReadingsTabGrid", "EnteredReading", expectedReadingValue);

        // Get all rows in the ReadingsTabGrid
        const grid = this.page.locator('[automation-grid="ReadingsTabGrid"]');
        const rows = grid.locator('[automation-row]');
        const count = await rows.count();

        let foundReading = false;

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const actionCell = row.locator('[automation-col="EnteredReading"]');
            const cellText = (await actionCell.textContent())?.trim();
            if (cellText === expectedReadingValue) foundReading = true;
        }

        expect(foundReading).toBe(true);
    }    
}