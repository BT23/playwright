import { writeFileSync, readFileSync } from 'fs';
import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class RequestPage {
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

        // Wait for element visibility using smart wait
        const navButton = this.page.locator('[automation-button="NavItemRequests"]');
        await navButton.waitFor({ state: 'visible', timeout: 5000 });

        await helper.clickButton("NavItemRequests");

        // Wait for page to load after navigation
        await this.page.waitForLoadState('networkidle');

        // Verify header is displayed
        const header = this.page.locator('[automation-header="RequestListingHeader"] span');
        await header.waitFor({ state: 'visible', timeout: 5000 });
    }

    /*
    ************************
    * Create New Request
    ************************
    */
    
    async createRequest(jobDesc: string, assetNumber: string, filePath?: string): Promise<string|null> {
        // click the New button to create a new Request
        await helper.clickButton("New");

        const createRequestHeader = this.page.locator('[automation-header="CreateRequest"]');
        await createRequestHeader.waitFor({ state: 'visible', timeout: 5000 });

        await helper.enterValueInDialog("CreateRequest", "JobDescription", jobDesc);

        // Enter the asset short name in the dialog/list
        const assetShortName = assetNumber.split(' ')[0].substring(0, 2);
        await helper.enterEllipseValueInDialog("CreateRequest", "Asset", assetShortName);      
        await this.page.waitForTimeout(1000);

        // Click the Create button to save the new Work Order
        await helper.clickButton("Create");

        // Wait until the WO Header is visible before clicking
        const woHeader = this.page.locator('[automation-header="RequestHeader"]');
        await woHeader.waitFor({ state: 'visible', timeout: 5000 });        

        // Locate the element using its class
        const requestElement = await this.page.locator('div.ml-2.text-5\\.5.text-secondary');
        // Get the text content
        const requestNumber = await requestElement.textContent();
        console.log('Request Number:', requestNumber?.trim());

        // Write the WO number to a JSON file if filePath is provided in fixtures.ts
        if (filePath) {
            // Save
            writeFileSync(filePath, JSON.stringify({ requestNumber }, null, 2));
        }
        return requestNumber;    
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
    * Click Refresh button
    ***************************
    */
    async clickRefreshBtn(): Promise<void> {
        await helper.clickButton("Refresh");
        await this.page.waitForTimeout(1000);
    }

    /*

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
    *************************************
    * Open Specified Request from Listing
    *************************************
    */
    async selectSpecificedRequest(requestNumber: string): Promise<void> {
         await helper.selectRowByFieldName("RequestListingGrid", "RequestNumber", requestNumber.trim());
        await this.page.waitForTimeout(1000);
    }

     /*
    **************************************************************************************************
    * Set Request Asset
    * This method enters the given asset number into the Asset field,
    * waits for the asset list to populate, and selects the first item from the list.
    * It uses a value mapping to handle cases where only the first word of the asset number is needed.
    * @param inDialog = true, uses enterValueInDialog. Otherwise, normal input.
    ***************************************************************************************************
    */
    
    async setRequestAsset(assetNumber: string, inDialog:boolean = false ): Promise<void> {

        const shortAssetNumber = assetNumber.split(' ')[0];

        await helper.enterValueInDialog("CreateRequest", "Asset", shortAssetNumber);

        await this.page.waitForTimeout(1000);

        // Select the first item from the Asset list
        await helper.selectFirstListItem();
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

    /******************************
    * Verification Methods
    *******************************
    */

    /*******************************************************************
    * Verify Approved appears on Request Listing - Request Status column
    ********************************************************************
    */
    async verifyRequestStatusEqualApprovedOnListing(
    requestNumber: string,
    expectedRequestStatus: string
    ): Promise<void> {

    const grid = this.page.locator('[automation-grid="RequestListingGrid"]');

    // Locate the row containing the request number
    const row = grid.locator('tr', {
        has: this.page.locator(
        `[automation-col="RequestNumber"]:has-text("${requestNumber.trim()}")`
        )
    });

    // Assert with auto-retry
    await expect(
        row.locator('[automation-col="RequestStatus"]')
    ).toHaveText(expectedRequestStatus.trim(), { timeout: 10000 });
    }


    /*******************************************************************
    * Verify Approved appears in Request Details Form - Status field
    ********************************************************************
    */
    async verifyRequestStatusEqualApprovedInDetailsForm(expectedRequestStatus: string): Promise<void> {

        const statusInput = this.page.locator('[automation-input="Status"]').first();

        // If the input’s value is updated programmatically, inputValue() is reliable
        await expect
            .poll(async () => (await statusInput.inputValue()).trim(), { timeout: 10_000 })
            .toMatch(new RegExp(`\\b${expectedRequestStatus.trim()}\\b`, 'i'));

    }
}