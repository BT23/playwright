import { expect, Page } from '@playwright/test';
import { helper } from '../helperMethods';

export class AssetPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*
    *********************
    *********************
    */

    async openAssetModule(): Promise<void> {
        await helper.clickButton("Assets");
        await helper.checkHeader("AssetRegisterHeader");
    }

    /*
    ************************
    * Create New Asset Test
    * **********************
    */
    async createNewAsset(): Promise<void> {
        await this.openAssetModule();
      
        await helper.clickButton("NewLevel1");

        //Fill in the asset details
        await helper.enterValue("Number", "Auto Test 3");
        await this.page.waitForTimeout(1000);
        await helper.enterValue("Description", "Playwright Auto Test 3");
        
        await helper.clickButton("Create");
    }

   /*
    ************************
    * Expand Tree Nodes Test
    * **********************
    */
    async expandTreeNodeByName(name: string) {
        await this.openAssetModule();

        await helper.expandTreeNodeByName(name);
    }

    async openAssetDetailsByRightClick(): Promise<void> {
        await this.openAssetModule();

        await helper.selectFirstRow("AssetRegisterTree");
        await helper.rightClickGrid("AssetRegisterTree");

        //These could be helper methods, since you are doing the same thing twice.
        //Have a menuName parameter and a menuItem parameter
        //Could even include the gridName and make it rightclick within the method as well
        const menu = this.page.locator('[automation-context-menu="AssetRegisterTreeMenu"]');
        const assetDetails = menu.locator('[automation-context-menu-item="AssetDetails"]');
        await assetDetails.click();
    }
}

