import { writeFileSync, readFileSync } from 'fs';
import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';
import { escapeRegex } from '../../helperMethods';

export class AssetPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

   /*
    **************************************
    * Locate and select Tree Node by Name
    * ************************************
    */
    async selectTreeNodeByName(assetNumber: string) {
        // Wait for tree nodes to populate
        const treeNodes = this.page.locator('td[automation-col="Number"]');
        await treeNodes.first().waitFor({ state: 'visible', timeout: 5000 });

        // Locate the asset in the tree
        const nodeFound = await helper.locateTreeNodeByName(assetNumber);

        if (nodeFound) {
            // ✅ Use exact match locator (generic)
            const escapedName = escapeRegex(assetNumber);
            const nodeLocator = this.page.locator('td[automation-col="Number"]')
                .filter({ hasText: new RegExp(`^${escapedName}$`, 'i') }); // exact match, case-insensitive

            const count = await nodeLocator.count();
            if (count === 0) {
                throw new Error(`Asset with number "${assetNumber}" not found.`);
            }
            if (count > 1) {
                console.warn(`Multiple matches found for "${assetNumber}". Clicking the first exact match.`);
            }

            await nodeLocator.first().click();
        } else {
            throw new Error(`Asset with number "${assetNumber}" not found in the tree.`);
        }
    }

    /*
    * Check if Asset Tree Node is Present
    * Usage: returns true if the tree node is found and clicked, false otherwise
    */
    async isTreeNodePresent(name: string): Promise<boolean> {
        try {
            await helper.locateTreeNodeByName(name);
            return true;
        } catch (e) {
            return false;
        }
    }

    /*
    *********************
    * Open Asset Register
    *********************
    */

    async openAssetModule(): Promise<void> {
        // Wait for element visibility using smart wait
        const navButton = this.page.locator('[automation-button="NavItemAssets"]');
        await navButton.waitFor({ state: 'visible', timeout: 5000 });

        await helper.clickButton("NavItemAssets");

        // Wait for page to load after navigation
        await this.page.waitForLoadState('networkidle');

        // Verify header is displayed
        const header = this.page.locator('[automation-header="AssetRegisterHeader"] span');
        await header.waitFor({ state: 'visible', timeout: 5000 });
    }

    /*
    **************************
    * Create New Level 1 Asset
    * ************************
    */
   async createLevel1Asset(assetNumber: string, assetDesc: string): Promise<void> {
        await helper.clickButton("NewLevel1");

        const createAssetHeader = this.page.locator('[automation-header="CreateLevel1Asset"]');
        await createAssetHeader.waitFor({ state: 'visible', timeout: 5000 });

        // Fill in the asset details from the createAssetData.json file
        await helper.enterValueInDialog("CreateLevel1Asset", "Number", assetNumber);
        //await this.page.waitForTimeout(1000);
        await helper.enterValueInDialog("CreateLevel1Asset", "Description", assetDesc);
        await helper.clickButton("Create");
        //await this.page.waitForTimeout(1000);

        // Wait for dialog to close or next action to complete
        await this.page.waitForLoadState('domcontentloaded');        
        // closeCount = 1 - close Asset Details form
        // closeCount = 2 - close Asset Details form and then close Asset Register
        //for (let i = 0; i < closeCount; i++) {
        //await helper.closePage();
        //await this.page.waitForTimeout(1000);
        //}
    }

    /*****************************************
    * Create New Asset with Reading Type Test
    * ***************************************
    */
   async addWarrantyAndReadingType(): Promise<void> {
         // Wait until the Items tab content is visible
        const extendedTabContent = this.page.locator('[automation-tab="DetailsTab"]');
        await extendedTabContent.waitFor({ state: 'visible', timeout: 5000 });

        await helper.clearInputField("ReadingType");

        // Set Reading Type to Hours
        await helper.enterValue("ReadingType", "Hours")
        await helper.selectFirstListItem();


        // enter Warranty start date as today
        // Get today's date in "YYYY-MM-DD" format "2025-06-16"
        const today = new Date().toISOString().slice(0, 10); 
        await helper.enterValue("Start_date", today);
        
        // enter Warranty finish date as one week later
        // Calculate one week later from today
        const weekLater = new Date(today);
        weekLater.setDate(weekLater.getDate() + 7);
        const weekLaterStr = weekLater.toISOString().slice(0, 10); // "YYYY-MM-DD" format
        await helper.enterValue("Finish_date", weekLaterStr);

        // enter Reading(hours)
        await helper.enterValue("WarrantyPeriodReading", "100");

        await this.page.waitForTimeout(1000);
        // Click the X button to close Asset Details
        //await helper.closePage();
        //await this.page.waitForTimeout(1000);
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
    * Click Details button
    ***************************
    */
    async clickDetailsBtn(): Promise<void> {
        const detailsBtn = this.page.locator('[automation-button="Details"]');
        await detailsBtn.waitFor({ state: 'visible', timeout: 5000 });        
        await helper.clickButton("Details");
    }

       /*
    ***************************
    * Click Details button
    ***************************
    */
    async clickDeleteBtn(): Promise<void> {
        const deleteBtn = this.page.locator('[automation-button="Delete"]');
        await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });        
        await helper.clickButton("Delete");
    } 

    /*
    ************************************************
    * Fill in Asset Details - Details Tab
    * * Warranty Start and Finish handled separately
    * **********************************************
    */
   async assetDetails_DetailsTab_FillAllFields(assetDetailsTabData: any): Promise<void> {
         // Wait until the Items tab content is visible
        const detailsTabContent = this.page.locator('[automation-tab="DetailsTab"]');
        await detailsTabContent.waitFor({ state: 'visible', timeout: 5000 });

        await helper.selectTab("DetailsTab");

        // Wait for dynamic fields to load
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('networkidle');

        // Use all fields from your JSON file
        const details = assetDetailsTabData.details;

        // Verification method uses the same JSON file, so we need to ensure the field names match
        // Map the field names to the UI field names due to differences in naming conventions in Asset Details - Details tab and Asset Details tab
        // This mapping is based on the field names in the JSON file and the expected UI field names
        const fieldMapping: Record<string, string> = {
        Supplier: "WarrantySupplier",
        Status: "AssetStatus"
        };
        
        const fillValueMapping: Record<string, (value: string) => string> = {
            // For Supplier, use the first word as the short name for filling
            Supplier: (value: string) => value.split(' ')[0],
            Manufacturer: (value: string) => value.split(' ')[0],
            ModelNumber: (value: string) => value.split(' ')[0]
        };

        // Only these fields require selectFirstListItem
        const selectListFields = [
            "AccountCode",
            "AssetType",
            "Manufacturer",
            "ModelNumber",
            "Department",
            "ReadingType",
            "AssetStatus",
            "WarrantySupplier"
        ];

        // Fill in the form fields using the helper method
        // This method will handle the mapping and filling of values
        await helper.fillFormFields(details, fieldMapping, fillValueMapping, selectListFields);
    }

   /*
    **************************************
    * Fill in Asset Details - EXTENDED Tab
    * ************************************
    */
   async assetDetails_ExtendedTab_FillAllFields(extendedTabData: any): Promise<void> {
        // Wait until the Items tab content is visible
        const extendedTabContent = this.page.locator('[automation-tab="ExtendedTab"]');
        await extendedTabContent.waitFor({ state: 'visible', timeout: 5000 });

        await helper.selectTab("ExtendedTab");

        // Use all fields from your JSON file
        const details = extendedTabData.details;

        const fillValueMapping: Record<string, (value: string) => string> = {
            // For Supplier, use the first word as the short name for filling
            Contractor: (value: string) => value.split(' ')[0],
            Customer: (value: string) => value.split(' ')[0]
        };

        // Only these fields require selectFirstListItem
        const selectListFields = [
            "Contractor",
            "Customer",
            "Criticality"
        ];

        // Fill in the form fields using the helper method
        // This method will handle the mapping and filling of values
        await helper.fillFormFields(details, undefined, fillValueMapping, selectListFields);
    }

    /***************************
    **  VERIFICATION TEST CODES
    ****************************
     */

   /*
    **************************************
    * Verify Tree Node is Present By Name
    * ************************************
    */
    async verifyTreeNodePresentByName(assetNumber: string): Promise<void> {
        console.log(`🔍 Verifying tree node present: ${assetNumber}`);
        
        // Wait for tree nodes to populate
        const treeNodes = this.page.locator('td[automation-col="Number"]');
        await treeNodes.first().waitFor({ state: 'visible', timeout: 5000 });

        // Use a timeout to prevent infinite waiting
        const isPresent = await Promise.race([
            this.isTreeNodePresent(assetNumber),
            new Promise<boolean>(resolve => setTimeout(() => resolve(false), 10000)) // 10 second timeout
        ]);
        
        if (!isPresent) {
            throw new Error(`❌ Asset ${assetNumber} should be present in the tree but was not found`);
        }
        
        console.log(`✅ Asset ${assetNumber} successfully verified in the tree`);
    }

   /*
    **************************************
    * Verify Tree Node is Not Present By Name
    * ************************************
    */
    async verifyTreeNodeNotPresentByName(assetNumber: string): Promise<void> {
        console.log(`🔍 Verifying tree node not present: ${assetNumber}`);
        
        // Wait for tree nodes to populate
        const treeNodes = this.page.locator('td[automation-col="Number"]');
        await treeNodes.first().waitFor({ state: 'visible', timeout: 5000 });

        // Use a timeout to prevent infinite waiting
        const isPresent = await Promise.race([
            this.isTreeNodePresent(assetNumber),
            new Promise<boolean>(resolve => setTimeout(() => resolve(false), 10000)) // 10 second timeout
        ]);
        
        if (isPresent) {
            throw new Error(`❌ Asset ${assetNumber} should not be present in the tree but was found`);
        }

        console.log(`✅ Asset ${assetNumber} successfully deleted and removed in the tree`);
    }

   /*
    **************************************
    * Verify Confirmation Dialog Visible and Click Yes
    * ************************************
    */    
    async confirmDeleteAction(dialogName: string, answer: string): Promise<void> {
        const dialog = this.page.locator(`[automation-dialog="${dialogName}"]`);
        await expect(dialog).toBeVisible();
        // Click the Ok button inside the dialog
        const answerButton = dialog.locator(`[automation-button="${answer}"]`);
        await answerButton.click();
    }    

    /*
    ***********************************************
    * Verify data populating on Asset - Details Tab
    * *********************************************
    */
    async verifyAssetRegisterDetailsTabInfo(detailsTabData: any): Promise<void> {
         // Wait until the Items tab content is visible
        const detailsTabContent = this.page.locator('[automation-tab="DetailsTab"]');
        await detailsTabContent.waitFor({ state: 'visible', timeout: 5000 });

        await helper.selectTab("DetailsTab");

        // Wait for dynamic fields to load
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('networkidle');    
        
        /*
        * Verify the information ppopulate on Details tab
        */  
        await helper.selectTab("DetailsTab");

        const expected = detailsTabData.details;
        const fieldsToVerify = [
        "Description",
        "AssetType",
        "Manufacturer",
        "ModelNumber",
        "AccountCode",
        "WarrantySupplier",
        "Department",
        "Comments",
        "AssetStatus",
        "SerialNumber",
        "ReadingType",
        "SafetyNotes",
        "AddressLine1",
        "AddressLine2",
        "City",
        "State",
        "PostCode"
        //"WarrantyStart",
        //"WarrantyFinish",
        ];

        // verifyFields method will check the values of the fields in the Details tab
        // It will compare the expected values from the JSON file with the actual values in the UI
        await helper.verifyFields(expected, fieldsToVerify);
    }   

   /*
    ***********************************************
    * Verify data populating on Asset - Details Tab
    * *********************************************
    */
    async verifyAssetRegisterDetailsTabExtendedInfo(extendedTabData: any): Promise<void> {
        // Wait until the Items tab content is visible
        const extendedTabContent = this.page.locator('[automation-tab="ExtendedTab"]');
        await extendedTabContent.waitFor({ state: 'visible', timeout: 5000 });

        await helper.selectTab("ExtendedTab");

         await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('networkidle');          

        // ✅ Wait for dynamic controls to load (dropdowns, ellipsis fields)
        await this.page.waitForSelector('[automation-input="Contractor"]', { state: 'visible', timeout: 5000 });
        await this.page.waitForSelector('[automation-input="Customer"]', { state: 'visible', timeout: 5000 });
        await this.page.waitForSelector('[automation-input="Criticality"]', { state: 'visible', timeout: 5000 });


        const expected = extendedTabData.details;
        const fieldsToVerify = [
        "Contractor",
        "Customer",
        "Criticality"
        ];

        // verifyFields method will check the values of the fields in the Details tab
        // It will compare the expected values from the JSON file with the actual values in the UI
        await helper.verifyFields(expected, fieldsToVerify);
    }

    /*
    ***********************************
    * Open Asset Details by Right Click
    * *********************************
    */
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