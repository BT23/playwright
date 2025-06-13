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
        // Click on the Work Orders button to open the Work Order module
        await helper.clickButton("WorkOrders");

        // Verify that the Work Order Listing header is displayed
        await helper.checkHeader("WorkOrderListingHeader");
    }

    /*
    ************************
    * Create New Work Order
    ************************
    */
    async createWorkOrder(data: { assetNumber: string, workorderDesc: string }): Promise<void> {
        await this.openWOModule();

        // click the New button to create a new Work Order
        await helper.clickButton("New");

        // Fill in the Work Order details from the createWorkOrderData.json file
        await helper.enterValue("Description", data.workorderDesc);        
        await helper.enterValue("Asset", data.assetNumber);
        
        await this.page.waitForTimeout(1000);

        // Select the first item from the Asset list
        await helper.selectFirstListItem();
        
        // Click the Create button to save the new Work Order
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
