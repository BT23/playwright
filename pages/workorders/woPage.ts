import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

import createWorkOrderData from '../../test-data/work-orders/createWorkOrderData.json';
import workOrderDetailsDetailsTabData from '../../test-data/work-orders/workOrderDetailsDetailsTabData.json';

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
        // Check if the "History" button is visible
        const historyButton = this.page.locator('[automation-button="WorkOrders"]');
        if (!(await historyButton.isVisible())) {
            await helper.addModuleToMenu("WorkOrders");
            await this.page.waitForTimeout(1000);
        }

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
    async createWorkOrder(
        assetNumberOrData: string | { assetNumber: string; workorderDesc: string }, workorderDesc?: string): Promise<void> {
        let assetNumber: string;
        let desc: string;

        if (typeof assetNumberOrData === 'object') {
            assetNumber = assetNumberOrData.assetNumber;
            desc = assetNumberOrData.workorderDesc;
        } else {
            assetNumber = assetNumberOrData;
            desc = workorderDesc!;
        }

        await this.openWOModule();

        // click the New button to create a new Work Order
        await helper.clickButton("New");

        // Fill in the Work Order details
        await helper.enterValue("Description", desc);        
        await helper.enterValue("Asset", assetNumber);

        await this.page.waitForTimeout(1000);

        // Select the first item from the Asset list
        await helper.selectFirstListItem();

        // Click the Create button to save the new Work Order
        await helper.clickButton("Create");
    }

   /*
    *************************************
    * Fill in WO Details - Details Tab
    * ***********************************
    */
   async workOrderDetails_DetailsTab_FillAllFields(): Promise<void> {
        await this.openWOModule();

        /*
        * Fill in the Details tab of the Work Order details form
        */
        await helper.selectFirstRow("WorkOrderListingGrid");

        await helper.clickButton("Details");
        
        // Use all fields from your JSON file
        const details = workOrderDetailsDetailsTabData;

        const fillValueMapping: Record<string, (value: string) => string> = {
            // For priority, use the first word as the short name for filling
            Priority: (value: string) => value.split(' ')[0]
        };

        // Only these fields require selectFirstListItem
        const selectListFields = [
            "AccountCode",
            "JobType",
            "Department",
            "ComponentCode"
        ];

        // Fill in the form fields using the helper method
        // This method will handle the mapping and filling of values
        await helper.fillFormFields(details, undefined, fillValueMapping, selectListFields);

        // Click the X button to save the changes
        await helper.closePage();
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

    /*
    ***************************
    * Open Specified Opened WO
    ***************************
    */
    async openClosedWOByWONumber(woNumber: string): Promise<void> {
        await helper.selectRowByFieldName("WorkOrderListingGrid","W/ONo", woNumber);
        await this.page.waitForTimeout(1000);
        await helper.clickButton("Details");
        await this.page.waitForTimeout(1000);
    }

    /*
    ******************
    * Print WO Report
    ******************
    */
    async printWOPrint(woNumber: string): Promise<void> {
        await helper.selectRowByFieldName("WorkOrderListingGrid","W/ONo", woNumber);
        await this.page.waitForTimeout(1000);
        await helper.clickButton("Print");
        await this.page.waitForTimeout(1000);
        await helper.clickButtonInDialog("WorkOrderPrint","Print");
        await this.page.waitForTimeout(1000);
    }

    /*************************************
    * Verify WO Asset Warranty Message box
    **************************************
    */
    async verifyWorkOrderAssetWararnty(
        assetNumberOrData: string | { assetNumber: string; workorderDesc: string }, workorderDesc?: string): Promise<void> {
        let assetNumber: string;
        let desc: string;

        if (typeof assetNumberOrData === 'object') {
            assetNumber = assetNumberOrData.assetNumber;
            desc = assetNumberOrData.workorderDesc;
        } else {
            assetNumber = assetNumberOrData;
            desc = workorderDesc!;
        }

        await this.openWOModule();

        // click the New button to create a new Work Order
        await helper.clickButton("New");

        // Fill in the Work Order details
        await helper.enterValue("Description", desc);        
        await helper.enterValue("Asset", assetNumber);

        await this.page.waitForTimeout(1000);

        // Select the first item from the Asset list
        await helper.selectFirstListItem();

        // Verify Dialog 'Asset Warranty' Message Box 
        await helper.verifyDialogVisible("AssetWarranty");
    }

    /******************************
    * Verify WO Requester Populated
    *******************************
    */
   async verifyWORequester(expectedRequester: string): Promise<void>{
        const actualRequester = await this.page.locator('[automation-input="Requester"]').inputValue();
        expect(actualRequester.trim()).toBe(expectedRequester.trim());
   }

    /**********************************
    * RMC and click Add Listing Columns
    ***********************************
    */
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

    /***********************
    * Reopen WO From Listing
    ************************
    */
    async reopenWOFromListing(): Promise<void> {
        await helper.selectFirstRow("WorkOrderListingGrid");
        await this.page.waitForTimeout(1000);
        await helper.clickButton("Details");
        await this.page.waitForTimeout(1000);
    }
}
