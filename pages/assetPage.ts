import { expect, Page } from '@playwright/test';
import { helper } from '../helperMethods';

import assetDetailsDetailsTabData from '../test-data/assets/assetDetailsDetailsTabData.json';
import assetDetailsExtendedTabData from '../test-data/assets/assetDetailsExtendedTabData.json';

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
   async createNewAsset(data: { assetNumber: string, assetDesc: string }): Promise<void> {
        await this.openAssetModule();

        await helper.clickButton("NewLevel1");

        // Fill in the asset details from the createAssetData.json file
        await helper.enterValueInDialog("CreateLevel1Asset", "Number", data.assetNumber);
        await this.page.waitForTimeout(1000);
        await helper.enterValueInDialog("CreateLevel1Asset", "Description", data.assetDesc);
        await helper.clickButton("Create");
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

        for (const [field, value] of Object.entries(details)) {
            const uiField = fieldMapping[field] || field;
            if (typeof value === 'string' && value.trim() !== '') {
                // Use the mapping function if present, otherwise use the value as is
                const fillValue = fillValueMapping[field] ? fillValueMapping[field](value) : value;
                await helper.enterValue(uiField, fillValue);
                if (selectListFields.includes(uiField)) {
                    await helper.selectFirstListItem();
                }
                await this.page.waitForTimeout(500);
            }
        }  
        await helper.closePage();
    }

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
        "Customer",
        "Criticality"
        ];

        for (const field of fieldsToVerify) {
            const expectedValue = expected[field];
            if (expectedValue !== undefined) {
                const actual = await helper.getFieldValue(field);
                expect(actual.trim().toLowerCase()).toBe(expectedValue.trim().toLowerCase());
            }
        }
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
            Contractor: (value: string) => value.split(' ')[0]
        };

        // Only these fields require selectFirstListItem
        const selectListFields = [
            "Contractor",
            "Customer",
            "Criticality"
        ];

        for (const [field, value] of Object.entries(details)) {
            if (typeof value === 'string' && value.trim() !== '') {
                // Use the mapping function if present, otherwise use the value as is
                const fillValue = fillValueMapping[field] ? fillValueMapping[field](value) : value;
                await helper.enterValue(field, fillValue);
                if (selectListFields.includes(field)) {
                    await helper.selectFirstListItem();
                }
                await this.page.waitForTimeout(500);
            }
        }
    await helper.closePage();
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