import { expect, Page } from '@playwright/test';

export class WoPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openWOModule(): Promise<void> {
        // Locate the "WorkOrders.png" element
        const woImage = await this.page.$('img[src="/_content/Mex.Blazor/images/WorkOrders.png"]');

        // Verify and click the "WO.png" element
        if (woImage !== null) {
            const isVisible = await woImage.isVisible();
            if (isVisible) {
                console.log('Main Menu WO icon is visible');
                await this.page.waitForTimeout(1000);
                await woImage.click();
                console.log('WO element clicked');
            
                // Locate the "Work Order Listing" element 
                const woListingHeader = await this.page.getByText('Work Order Listing');
                await expect(woListingHeader).toBeVisible();
            } else {
            console.log('Main Menu WO icon not found');
            }
        }
    }

    private woAsset = 'input.h-8.outline-none.w-full.h-\\[30px\\]';
    private woDesc = 'textarea#Description';

    async createWO(): Promise<void> {
        await this.openWOModule();

        // Define the selector for the New button
        const woNewButton = 'button:has-text("New")';

        // Wait for the New button to be visible
        await this.page.waitForSelector(woNewButton, { state: 'visible' });

        // Click the New button
        await this.page.click(woNewButton);

        console.log('New button clicked');

        //Fill in the asset details
        await this.page.fill(this.woDesc, 'WO - Auto Test 1');
        await this.page.fill(this.woAsset, 'Auto Test 5');
        
        // Locate and click the "Create" button
        const createButton = this.page.locator('span.inline-block.text-center:has-text("Create")');
        await createButton.click();
    }
}
