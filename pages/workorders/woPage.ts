import { writeFileSync, readFileSync } from 'fs';
import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class WoPage {

    private page: Page;

    constructor(page: Page) {

        this.page = page;
        helper.setPage(page);

    }

    async goto() {
        await this.openWOModule();
    }

    /*
    ************************
    * Open Work Order Module
    ************************
    */
    async openWOModule(): Promise<void> {
        // Wait for the Work Orders button to become visible
        await this.page.waitForSelector('[automation-button="NavItemWork Orders"]', { state: 'visible', timeout: 10000 });

        // Click on the Work Orders button to open the Work Order module
        await helper.clickButton("NavItemWork Orders");

        // Verify that the Work Order Listing header is displayed
        await this.page.waitForSelector('[automation-header="WorkOrderListingHeader"] span', { state: 'visible', timeout: 10000 });        
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
        await woHeader.waitFor({ state: 'visible', timeout: 10000 });        

        // Wait until the Asset button is visible
        const assetLabel = this.page.locator('[automation-label="lblAsset"]');
        await assetLabel.waitFor({ state: 'visible', timeout: 10000 });    

        // The generated number is rendered in the Work Order page title.
        await expect(woHeader).toContainText(/Work Order\s*\S+/i, { timeout: 10000 });
        const headerText = await woHeader.innerText();
        const woNumber = headerText.match(/Work Order\s*(\S+)/i)?.[1]?.trim() ?? '';
        console.log('Work Order Number:', woNumber);

        // Write the WO number to a JSON file if filePath is provided in fixtures.ts
        if (filePath) {
            // Save
            writeFileSync(filePath, JSON.stringify({ woNumber }, null, 2));
        }
        return woNumber || null;
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

    /************************
    * Click Tasks tab
    ************************
    */    
  async clickTasksTab(): Promise<void> {
        await helper.selectTab("TasksTab");
        await this.page.waitForTimeout(1000);
  }

    /*
    ************************
    * Enter Account Code
    ************************
    */    
  async enterAccountCode(accountCode: string): Promise<void> {
        // Enter Account Code
        //const accountCodeShortName = accountCode.split(' ')[0].substring(0, 2);  
        await helper.enterValue("AccountCode", accountCode);
        //await helper.selectFirstListItem();
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
    * Enter Requester
    ************************
    */    
  async enterRequester(requester: string): Promise<void> {
        // Enter Requester
        await helper.enterValue("Requester", requester);
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
        const field = this.page.locator('[automation-input="Item"]');
        await field.press('Tab');
        await this.page.waitForTimeout(1000);

        // Wait for the UpdateAPL dialog to appear (with a reasonable timeout)
        // Use the dialog container if available; if not, use header then parent or a known container.
        const updateAPLDialog = this.page.locator('[automation-dialog="UpdateAPL"]');
        const dialogVisible = await updateAPLDialog.waitFor({ state: 'visible', timeout: 3000 })
        .then(() => true)
        .catch(() => false);

        if (dialogVisible) {
        // Scope the locator to the dialog to avoid clicking wrong elements
        const noButton = updateAPLDialog.locator('[automation-button="No"]');

        // Ensure it's actually visible and enabled before clicking
        await noButton.waitFor({ state: 'visible', timeout: 3000 });

        // Optional: wait for any overlay animations to complete
        await this.page.waitForTimeout(100); // short settle

        await noButton.click();

        // Optional: wait for the dialog to disappear to ensure click took effect
        await updateAPLDialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
        }

        await helper.enterValueInCell(newRow, "EstimatedQuantity", EstQuantity);
        await this.page.waitForTimeout(1000);
    }    

   /*
    ************************
    * WO Tasks Tab
    ************************
    */

    /*
    ************************
    * Add Work Order Task
    ************************
    */
    async addWOTask(TaskDesc: string, TaskType: string): Promise<void> {
        const woHeader = this.page.locator('[automation-header="WorkOrderHeader"]');
        await woHeader.waitFor({ state: 'visible', timeout: 5000 });

        // Wait until the ItemsTab button is visible before clicking
        const itemsTab = this.page.locator('[automation-tab="TasksTab"]');
        await itemsTab.waitFor({ state: 'visible', timeout: 5000 });

        await helper.selectTab("TasksTab");
        await this.page.waitForTimeout(1000);

        const addBtn = this.page.locator('[automation-button="Add"]');
        await addBtn.waitFor({ state: 'visible', timeout: 5000 });

        await helper.clickButton("Add");
        await this.page.waitForTimeout(1000);

        /*
        * Enter Task Description
        */
        const newRow = await helper.selectLastRow("TasksTabGrid");
        const descriptionCell = newRow.locator('[automation-col="Description"]');
        await descriptionCell.click();
        await this.page.waitForTimeout(500);
        const descriptionInput = descriptionCell.locator('[automation-input="Description"]');
        await descriptionInput.fill(TaskDesc);
        await descriptionInput.press('Tab');
        await this.page.waitForTimeout(500);
    }

    /*
    ************************
    * Enter Task Reading Type
    ************************
    */    
    async enterTaskReadingType(taskReadingType: string): Promise<void> {
        const newRow = await helper.selectLastRow("TasksTabGrid");
        // Enter Task Reading
        await helper.enterValueInCell(newRow, "Type", taskReadingType);
        await this.page.waitForTimeout(1000);
    }

    /*
    ************************
    * Enter Completed Date in History WO
    ************************
    */    
    async enterCompletedDate(completedDate: string): Promise<void> {
        const newRow = await helper.selectLastRow("TasksTabGrid");     
        // Enter Completed Date
        const dateOnly = completedDate.split('T')[0].trim(); // "2025-06-12"
        const completedDateCell = newRow.locator('[automation-col="CompletedDate"]');
        await completedDateCell.click();
        const completedDateField = completedDateCell.locator('[automation-input="CompletedDate_date"]');
        await completedDateField.fill(dateOnly);
        await expect(completedDateField).toHaveValue(dateOnly);
        await this.page.waitForTimeout(1000);
        await newRow.locator('[automation-col="Reading"]').click();
        await this.page.waitForTimeout(1000);
    }

    /*
    ************************
    * Enter Task Reading in History WO
    ************************
    */    
    async enterTaskReading(taskReading: string): Promise<void> {
        const newRow = await helper.selectLastRow("TasksTabGrid");
        // Enter Task Reading
        await helper.enterValueInCell(newRow, "Reading", taskReading);
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
        //await helper.selectRowByFieldName("WorkOrderListingGrid","W/ONo", woNumber);
        await helper.selectRowByFieldName("WorkOrderListingGrid", "W/ONo", woNumber.trim());
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
    ***************************
    * Click Add Purchase Order button
    ***************************
    */
    async clickAddPOBtn(): Promise<void> {
        await helper.clickButton("AddPurchaseOrder");
        await this.page.waitForTimeout(1000);
    }
    
    /*
    ***************************
    * Click Close Work Order button
    ***************************
    */
    async clickCloseWOBtn(): Promise<void> {
        await helper.clickButton("CloseWorkOrder");
        await this.page.waitForTimeout(1000);

        await this.page.waitForSelector('[automation-dialog="CloseWorkOrderConfirmation"]', { state: 'visible', timeout: 5000 });
        await helper.clickButtonInDialog("CloseWorkOrderConfirmation", "Yes");
        await this.page.waitForTimeout(1000);

        await this.page.waitForSelector('[automation-dialog="AddHistory"]', { state: 'visible', timeout: 5000 });
        await helper.clickButtonInDialog("AddHistory", "Yes");
        await this.page.waitForTimeout(1000);

        // Wait until the History WO Header is visible before clicking
        const historyWOHeader = this.page.locator('[automation-header="HistoryWorkOrderHeader"]');
        await historyWOHeader.waitFor({ state: 'visible', timeout: 10000 });    
    }
    
    /*
    ******************
    * Print WO Report
    ******************
    */
    async printWOReport(woNumber: string, fromDetailsForm: boolean): Promise<void> {
        // Determine the correct header based on the view
        const headerSelector = fromDetailsForm
            ? '[automation-header="WorkOrderHeader"]'
            : '[automation-header="WorkOrderListingHeader"]';

        const woHeader = this.page.locator(headerSelector).first();
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
        const reportHeader = this.page.locator('[automation-header="WorkOrderReport"] span').first();
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

     /********************************
    * Verify Request Number Populated
    **********************************
    */
   async verifyWORequestNumber(expectedRequestNumber: string): Promise<void>{
        await this.page.waitForSelector('[automation-input="RequestNo"]');
        const actualRequestNumber = await this.page.locator('[automation-input="RequestNo"]').inputValue();        
        if (actualRequestNumber.trim() !== expectedRequestNumber.trim()) {
            throw new Error(`Expected requester to be "${expectedRequestNumber}", but got "${actualRequestNumber}"`);
        }

   }  

     /********************************
    * Verify Reading Value Retained in History Work Orkder Task
    **********************************
    */
   async verifyTaskReadingRetained(expectedReading: string): Promise<void>{
        const newRow = await helper.selectLastRow("TasksTabGrid");
        const taskReadingCell = newRow.locator('[automation-col="taskReading"]');
        const actualReading = await taskReadingCell.inputValue();
        if (actualReading.trim() !== expectedReading.trim()) {
            throw new Error(`Expected Task Reading to be "${expectedReading}", but got "${actualReading}"`);
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
