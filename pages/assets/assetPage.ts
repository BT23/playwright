import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

import createAssetData from '../../test-data/assets/createAssetData.json';
import assetDetailsDetailsTabData from '../../test-data/assets/assetDetailsDetailsTabData.json';
import assetDetailsExtendedTabData from '../../test-data/assets/assetDetailsExtendedTabData.json';

export class AssetPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    // Usage: returns true if the tree node is found and clicked, false otherwise
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
        await helper.clickButton("Assets");
        await helper.checkHeader("AssetRegisterHeader");
    }

    /*
    ************************
    * Create New Asset Test
    * **********************
    */
   async createNewAsset(assetNumber: string, assetDesc: string, closeCount: number =1 ): Promise<void> {
        await this.openAssetModule();

        await helper.clickButton("NewLevel1");

        // Fill in the asset details from the createAssetData.json file
        await helper.enterValueInDialog("CreateLevel1Asset", "Number", assetNumber);
        await this.page.waitForTimeout(1000);
        await helper.enterValueInDialog("CreateLevel1Asset", "Description", assetDesc);
        await helper.clickButton("Create");
        await this.page.waitForTimeout(1000);

        // closeCount = 1 - close Asset Details form
        // closeCount = 2 - close Asset Details form and then close Asset Register
        for (let i = 0; i < closeCount; i++) {
        await helper.closePage();
        await this.page.waitForTimeout(1000);
        }
    }

    /*****************************************
    * Create New Asset with Readign Type Test
    * ***************************************
    */
   async addWarrantyAndReadingType(assetNumber: string): Promise<void> {
 
       // Locate the asset in the tree
        const nodeFound = await helper.locateTreeNodeByName(assetNumber);
        
        // If the node is found, click the Details button
        if (nodeFound) {
            await helper.clickButton("Details");
        } else {
            throw new Error(`Asset with number ${assetNumber} not found in the tree.`);
        }

        /*
        * Fill in the Details tab of the asset details form
        */
        await helper.selectTab("DetailsTab");

        // Set Reading Type to Hours
        await helper.enterValue("ReadingType", "Hours")
        await helper.selectFirstListItem();

        // enter Warranty start date as today
        // Get today's date in "YYYY-MM-DD" format "2025-06-16"
        const today = new Date().toISOString().slice(0, 10); 
        await helper.enterValue("Start", today);
        
        // enter Warranty finish date as one week later
        // Calculate one week later from today
        const weekLater = new Date(today);
        weekLater.setDate(weekLater.getDate() + 7);
        const weekLaterStr = weekLater.toISOString().slice(0, 10); // "YYYY-MM-DD" format
        await helper.enterValue("Finish", weekLaterStr);

        // enter Reading(hours)
        await helper.enterValue("WarrantyPeriodReading", "100");

        await this.page.waitForTimeout(1000);
        // Click the X button to close Asset Details
        await helper.closePage();

        await this.page.waitForTimeout(1000);
        // Click the X button to close Asset Register
        await helper.closePage();
    }

    /*
    *************************************
    * Fill in Asset Details - Details Tab
    * ***********************************
    */
   async assetDetails_DetailsTab_FillAllFields(assetNumber: string): Promise<void> {
        await this.openAssetModule();

        // Locate the asset in the tree
        const nodeFound = await helper.locateTreeNodeByName(assetNumber);
        
        // If the node is found, click the Details button
        if (nodeFound) {
            await helper.clickButton("Details");
        } else {
            throw new Error(`Asset with number ${assetNumber} not found in the tree.`);
        }

        /*
        * Fill in the Details tab of the asset details form
        */
        await helper.selectTab("DetailsTab");

        // Use all fields from your JSON file
        const details = assetDetailsDetailsTabData.details;

        // Verification method uses the same JSON file, so we need to ensure the field names match
        // Map the field names to the UI field names due to differences in naming conventions in Asset Details - Details tab and Asset Details tab
        // This mapping is based on the field names in the JSON file and the expected UI field names
        const fieldMapping: Record<string, string> = {
        Supplier: "WarrantySupplier",
        Status: "AssetStatus",
        WarrantyStart: "Start",
        WarrantyFinish: "Finish"
        };
        
        const fillValueMapping: Record<string, (value: string) => string> = {
            // For Supplier, use the first word as the short name for filling
            Supplier: (value: string) => value.split(' ')[0]
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

        // Click the X button to save the changes
        await helper.closePage();
    }

   /*
    **************************************
    * Fill in Asset Details - EXTENDED Tab
    * ************************************
    */
   async assetDetails_ExtendedTab_FillAllFields(assetNumber: string): Promise<void> {
        await this.openAssetModule();

        // Locate the asset in the tree
        const nodeFound = await helper.locateTreeNodeByName(assetNumber);
        
        // If the node is found, click the Details button
        if (nodeFound) {
            await helper.clickButton("Details");
        } else {
            throw new Error(`Asset with number ${assetNumber} not found in the tree.`);
        }

        /*
        * Fill in the Extended tab of the asset details form
        */
        await helper.selectTab("ExtendedTab");

        // Use all fields from your JSON file
        const details = assetDetailsExtendedTabData.details;

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

        // Click the X button to save the changes
        await helper.closePage();
    }

    /***************************
    **  VERIFICATION TEST CODES
    ****************************
     */

    /*
    ***********************************************
    * Verify data populating on Asset - Details Tab
    * *********************************************
    */
    async verifyAssetRegisterDetailsTabInfo(assetNumber: string): Promise<void> {
        await this.openAssetModule();

        // Locate the asset in the tree and click on the node itself
        const nodeFound = await helper.locateTreeNodeByName(assetNumber);

        if (!nodeFound) {
            throw new Error(`Asset with number ${assetNumber} not found in the tree.`);
        }
        
        await this.page.waitForTimeout(1000);

        /*
        * Verify the information ppopulate on Details tab
        */  
        await helper.selectTab("DetailsTab");

        const expected = assetDetailsDetailsTabData.details;
        const fieldsToVerify = [
        "Description",
        "AssetType",
        "Manufacturer",
        "ModelNumber",
        "AccountCode",
        "Supplier",
        "Department",
        "Comments",
        "Status",
        "SerialNumber",
        "WarrantyStart",
        "WarrantyFinish",
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
    async verifyAssetRegisterDetailsTabExtendedInfo(assetNumber: string): Promise<void> {
        await this.openAssetModule();

        // Locate the asset in the tree and click on the node itself
        const nodeFound = await helper.locateTreeNodeByName(assetNumber);

        if (!nodeFound) {
            throw new Error(`Asset with number ${assetNumber} not found in the tree.`);
        }
        
        await this.page.waitForTimeout(1000);

        /*
        * Verify the information ppopulate on Details tab
        */  
        await helper.selectTab("DetailsTab");

        const expected = assetDetailsDetailsTabData.details;
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
    ************************
    * Expand Tree Nodes Test
    * **********************
    */
    async locateTreeNodeByName(name: string) {
        await this.openAssetModule();

        await helper.locateTreeNodeByName(name);
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