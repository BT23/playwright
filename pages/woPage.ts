import { expect, Page } from '@playwright/test';
import { helper } from '../helperMethods';

export class WoPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*
    ************************
    * Open Work Order Module
    ************************
    */

    async openWOModule(): Promise<void> {
        await helper.clickButton("WorkOrders");
        await helper.checkHeader("WorkOrderListingHeader");
    }

    /*
    ************************
    * Create New Work Order
    ************************
    */
    async createNewWO(): Promise<void> {
        await this.openWOModule();

        await helper.clickButton("New");
        await helper.enterValue("Description", "WO - Auto Test");        
        //If you want, you could create a helper method that will enterValue and select the firstListItem
        //or just leave them seperate. Up to you.
        await helper.enterValue("Asset", "Asset #1");
        await helper.selectFirstListItem();
        await helper.clickButton("Create");
    }

    /*
    ************************
    * Add Work Order Spare
    ************************
    */
    async addWOSpare(): Promise<void> {
        await this.openWOModule();

        await helper.selectFirstRow("WorkOrderListingGrid");
        await helper.clickButton("Details");
        await helper.selectTab("SparesTab");
        await helper.clickButton("Add");

        /*
        * Enter Catalogue item
        */
        const newRow = await helper.selectLastRow("SparesTabGrid");
        await helper.enterValueInCell(newRow, "Item", "000003");
        await helper.selectFirstListItem();

        await helper.enterValueInCell(newRow, "EstimatedQuantity", "2");

        await helper.closePage();
    }    

    async clickAddListingColumns(): Promise<void> {
        await this.openWOModule();

        await helper.rightClickGrid("WorkOrderListingGrid");

        //These could be helper methods, since you are doing the same thing twice.
        //Have a menuName parameter and a menuItem parameter
        //Could even include the gridName and make it rightclick within the method as well
        const menu = this.page.locator('[automation-context-menu="WorkOrderListingGridMenu"]');
        const addListingColumns = menu.locator('[automation-context-menu-item="AddListingColumns"]');
        await addListingColumns.click();
    }   
}
