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

    /*
    *********************
    * Open Readings Module
    *********************
    */

    async openReadingsModule(): Promise<void> {
        await helper.clickButton("Readings");
        await helper.checkHeader("AssetReadingListingHeader");
        await this.page.waitForTimeout(1000);
    }

    async locateAndAddAssetReading(assetNumber: string, readingValue: string): Promise<void> {
        await helper.selectRowByFieldName("AssetReadingListingGrid","AssetNo", assetNumber);
        await helper.clickButton("AddReading");
        await helper.enterValueInDialog("AddReading", "CurrentReading", readingValue);
        await this.page.waitForTimeout(1000);
        await helper.clickButton("Process");
        await helper.closePage();
    }
}