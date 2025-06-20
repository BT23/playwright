import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class RequestPage {
    static openRequestsModule() {
        throw new Error('Method not implemented.');
    }
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        helper.setPage(page);
    }

    /*
    *********************
    * Open Requests Module
    *********************
    */

    async openRequestsModule(): Promise<void> {
        await helper.clickButton("Requests");
        await helper.checkHeader("RequestListingHeader");
    }

    /*
    ************************
    * Create New Request
    ************************
    */
    
    async createRequest(jobDesc: string ): Promise<void> {
    
        await this.openRequestsModule();
     
        // click the New button to create a new Request
        await helper.clickButton("New");

        await helper.enterValueInDialog("CreateRequest", "JobDescription", jobDesc);
        await this.page.waitForTimeout(1000);    
        
        // Click the Create button to save the new Work Order
        await helper.clickButton("Create");
    }

    /*
    ***************************************************************************************
    * Approve Request and Confirm
    * This method clicks the "Approve" button to approve the request,
    * then waits for the "RequestApproval" dialog box to appear and clicks "OK" to confirm.
    ***************************************************************************************
    */
    
    async approveRequestAndClickOK(): Promise<void> {
        await helper.clickButton("Approve");
        await helper.verifyDialogVisibleAndClickOk("RequestApproval");
    }
    
    /*
    ************************************************************************************************
    * Create Request Work Order
    * This method clicks the "Create Work Order" button 
    * (supports both "CreateWorkOrder" and "CreateWO" button names).
    * It retrieves and returns the value of the "RequestedBy" field before creating the Work Order.
    * Returns:
    *   The value of the "RequestedBy" field (string) for WO Requester verification.
    ************************************************************************************************
    */
    async createRequestWorkOrder(): Promise<string> {

        const requesterInput = this.page.locator('[automation-input="RequestedBy"]');
        const requester = (await requesterInput.inputValue()).trim();        
        
        // Try "CreateWorkOrder" first, then "CreateWO" if not found
        const buttonNames = ["CreateWorkOrder", "CreateWO"];
        let clicked = false;

        for (const name of buttonNames) {
            const button = this.page.locator(`[automation-button="${name}"]`);
            if (await button.count() > 0 && await button.first().isVisible()) {
                await button.first().click();
                await this.page.waitForTimeout(1000);
                clicked = true;
                break;
            }
        }
        if (!clicked) {
            throw new Error('Neither "CreateWorkOrder" nor "CreateWO" button was found.');
        }

        // Return the Requester value for verification
        return requester;
    }

    /*
    **************************************************************************************************
    * Reopen Request from Listing
    * This method searches for a request in the request listing by its job description or asset number,
    * and clicks to reopen or view the details of that request.
    * @param searchValue - The value (e.g., job description or asset number) to search for in the listing.
    **************************************************************************************************
    */
    async reopenRequestFromListing(): Promise<void> {
        await helper.selectFirstRow("RequestListingGrid");
        await this.page.waitForTimeout(1000);
        await helper.clickButton("Details");
        await this.page.waitForTimeout(1000);
    }

     /*
    **************************************************************************************************
    * Set Request Asset
    * This method enters the given asset number into the Asset field,
    * waits for the asset list to populate, and selects the first item from the list.
    * It uses a value mapping to handle cases where only the first word of the asset number is needed.
    * @param assetNumber - The asset number to enter in the Asset field.
    ***************************************************************************************************
    */
    
    async setRequestAsset(assetNumber: string ): Promise<void> {

        const fillValueMapping: Record<string, (value: string) => string> = {
        // For Asset, use the first word as the short name for filling
        assetNumber: (value: string) => value.split(' ')[0]
        };

        await helper.enterValue("Asset", assetNumber);

        await this.page.waitForTimeout(1000);

        // Select the first item from the Asset list
        await helper.selectFirstListItem();
    }
   
}