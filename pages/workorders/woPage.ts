import { writeFileSync, readFileSync } from 'fs';
import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

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
        // Wait for the Work Orders button to become visible
        await this.page.waitForSelector('[automation-button="NavItemWorkOrders"]', { state: 'visible', timeout: 5000 });

        // Click on the Work Orders button to open the Work Order module
        await helper.clickButton("NavItemWorkOrders");

        // Verify that the Work Order Listing header is displayed
        await this.page.waitForSelector('[automation-header="WorkOrderListingHeader"] span', { state: 'visible', timeout: 5000 });        
    }

    /*
    ************************
    * Create New Work Order
    ************************
    */
    async createWO(woAsset: string, woDesc:string, filePath?: string): Promise<string|null> {
    // Click the New button to create a new Work Order
        await helper.clickButton("New");

        // Enter Work Order Description
        await helper.enterValueInDialog("CreateWorkOrder", "Description", woDesc);
        await this.page.waitForTimeout(1000);

        // Enter the asset short name in the dialog/list
        const assetShortName = woAsset.split(' ')[0].substring(0, 2);
        await helper.enterEllipseValueInDialog("CreateWorkOrder", "Asset", assetShortName);      
        await this.page.waitForTimeout(1000);

        // Click the Create button to save the new Purchase Order
        await helper.clickButton("Create");

        // Wait until the WO Header is visible before clicking
        const woHeader = this.page.locator('[automation-header="WorkOrderHeader"]');
        await woHeader.waitFor({ state: 'visible', timeout: 5000 });        

        // Locate the element using its class
        const workOrderElement = await this.page.locator('div.ml-2.text-5\\.5.text-secondary');
        // Get the text content
        const woNumber = await workOrderElement.textContent();
        console.log('Work Order Number:', woNumber?.trim());

        // Write the WO number to a JSON file if filePath is provided in fixtures.ts
        if (filePath) {
            // Save
            writeFileSync(filePath, JSON.stringify({ woNumber }, null, 2));
        }
        return woNumber;
    }

    /*
    ************************
    * WO Details Tab
    ************************
    */
    /*
    ************************
    * Click Details tab
    ************************
    */    
  async clickDetailsTab(): Promise<void> {
        await helper.selectTab("DetailsTab");
        await this.page.waitForTimeout(1000);
  }

    /*
    ************************
    * Click Spares tab
    ************************
    */    
  async clickSparesTab(): Promise<void> {
        await helper.selectTab("SparesTab");
        await this.page.waitForTimeout(1000);
  }

    /*
    ************************
    * Enter Account Code
    ************************
    */    
  async enterAccountCode(accountCode: string): Promise<void> {
        // Enter Account Code
        const accountCodeShortName = accountCode.split(' ')[0].substring(0, 2);  
        await helper.enterValue("AccountCode", accountCodeShortName);
        await helper.selectFirstListItem();
        await this.page.waitForTimeout(1000);
  }

    /*
    ************************
    * Enter Job Type
    ************************
    */    
  async enterJobType(jobType: string): Promise<void> {
        // Enter Job Code
        const jobTypeShortName = jobType.split(' ')[0].substring(0, 2);
        await helper.enterValueByIndex("JobType", jobTypeShortName);
        await helper.selectFirstListItem();
        await this.page.waitForTimeout(1000);
  }

    /*
    ************************
    * Enter Department
    ************************
    */    
  async enterDepartment(department: string): Promise<void> {
        // Enter Department
        const deptShortName = department.split(' ')[0].substring(0, 2);  
        await helper.enterValueByIndex("Department", deptShortName);
        await helper.selectFirstListItem();
        await this.page.waitForTimeout(1000);//
  }

    /*
    ************************
    * Enter Start Date Time
    ************************
    */    
  async enterStartDateTime(startDate: string): Promise<void> {
        // Enter Start Date
        const dateOnly = startDate.split('T')[0]; // "2025-06-12"
        await helper.enterValueByIndex("Started_date", dateOnly);
        await this.page.waitForTimeout(1000);

        const timeOnly = startDate.split('T')[1].substring(0, 5); // "10:30"
        await helper.enterValueByIndex("Started_time", timeOnly);
        await this.page.waitForTimeout(1000);
  }

    /*
    ************************
    * WO Spares Tab
    ************************
    */

    /*
    ************************
    * Add Work Order Spare
    ************************
    */
    async addWOSpare(catalogueItem: string, EstQuantity: string): Promise<void> {
        const woHeader = this.page.locator('[automation-header="WorkOrderHeader"]');
        await woHeader.waitFor({ state: 'visible', timeout: 5000 });

        // Wait until the ItemsTab button is visible before clicking
        const itemsTab = this.page.locator('[automation-tab="SparesTab"]');
        await itemsTab.waitFor({ state: 'visible', timeout: 5000 });

        await helper.selectTab("SparesTab");

        const addBtn = this.page.locator('[automation-button="Add"]');
        await addBtn.waitFor({ state: 'visible', timeout: 5000 });

        await helper.clickButton("Add");

        /*
        * Enter Catalogue item
        */
        const newRow = await helper.selectLastRow("SparesTabGrid");
        await helper.enterValueInCell(newRow, "Item", catalogueItem);
        await helper.selectFirstListItem();
        await this.page.waitForTimeout(1000);

        await helper.enterValueInCell(newRow, "EstimatedQuantity", EstQuantity);
        await this.page.waitForTimeout(1000);
    }    

    /*
    ************************
    * WO Listing Operations
    ************************
    */

    /*
    ***************************
    * Open Specified Opened WO
    ***************************
    */
    async selectSpecificedWO(woNumber: string): Promise<void> {
        await helper.selectRowByFieldName("WorkOrderListingGrid","W/ONo", woNumber);
        await this.page.waitForTimeout(1000);
    }

    /*
    ***************************
    * Click WO Details Button
    ***************************
    */
    async clickWODetailsBtn(): Promise<void> {
        await helper.clickButton("Details"); 
        
        const woHeader = this.page.locator('[automation-header="WorkOrderHeader"]');
        await woHeader.waitFor({ state: 'visible', timeout: 5000 });        
        
        // Wait until the Details Tab button is visible before clicking
        const itemsTab = this.page.locator('[automation-tab="DetailsTab"]');
        await itemsTab.waitFor({ state: 'visible', timeout: 5000 });
    }

    /*
    ***************************
    * Click Back button
    ***************************
    */
    async clickBackBtn(): Promise<void> {
        await helper.closePage();
        await this.page.waitForTimeout(1000);
    }

    /*
    ******************
    * Print WO Report
    ******************
    */
    async printWOReport(woNumber: string, fromDetailsForm: boolean): Promise<void> {
        // Determine the correct header based on the view
        const headerSelector = fromDetailsForm
            ? '[automation-header="WorkOrderHeader"] span'
            : '[automation-header="WorkOrderListingHeader"] span';

        const woHeader = this.page.locator(headerSelector);
        await expect(woHeader).toBeVisible();
        await this.page.waitForTimeout(1000);

        // Click the Print button
        await helper.clickButton("Print");
        await this.page.waitForTimeout(1000);

        // Conditionally click the Print button in the dialog if it appears
        const dialogHeader = this.page.locator('[automation-header="WorkOrderPrint"]');
        if (await dialogHeader.isVisible()) {
            await helper.clickButtonInDialog("WorkOrderPrint", "Print");
            await this.page.waitForTimeout(1000);
        }

        // Confirm the Work Order Report header is visible
        const reportHeader = this.page.locator('[automation-header="WorkOrderReport"] span');
        await expect(reportHeader).toBeVisible();
    }


    /*
    ************************
    * Verification Methods
    ************************
    */

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
    * Verification Methods
    *******************************
    */

    /******************************
    * Verify WO Requester Populated
    *******************************
    */
   async verifyWORequester(expectedRequester: string): Promise<void>{
        await this.page.waitForSelector('[automation-input="Requester"]');
        const actualRequester = await this.page.locator('[automation-input="Requester"]').inputValue();        
        if (actualRequester.trim() !== expectedRequester.trim()) {
            throw new Error(`Expected requester to be "${expectedRequester}", but got "${actualRequester}"`);
        }

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
