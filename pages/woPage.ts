import { expect, Page } from '@playwright/test';

export class WoPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /*
    ************************
    * Open Work Order Module
    ************************
    */

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
                console.log('WO icon clicked');
            
                // Locate the "Work Order Listing" element 
                const woListingHeader = await this.page.getByText('Work Order Listing');
                await expect(woListingHeader).toBeVisible();
            } else {
            console.log('Main Menu WO icon not found');
            }
        }
    }

    /*
    ************************
    * Create New Work Order
    ************************
    */

    private woDesc = 'textarea#Description';
    private woAsset = 'input.h-8.outline-none.w-full.h-\\[30px\\][tabindex="0"]';

    async createNewWO(): Promise<void> {
        await this.openWOModule();

        // Declare WO New button
        const woNewButton = "img[src='/_content/Mex.Blazor/images/New.png']";

        // Wait for the New button to be visible
        await this.page.waitForSelector(woNewButton, { state: 'visible' });

        // Check if the New button is visible
        const newWOButton = await this.page.$("img[src='/_content/Mex.Blazor/images/New.png']");

        // Check if the "New" button is visible 
        if (newWOButton !== null) { 
            const isVisible = await newWOButton.isVisible(); 
            if (isVisible) { 
                console.log('New button is visible');

            // Click the New button
            newWOButton.click();

            //Fill in the WO Description and WO Asset
            await this.page.fill(this.woDesc, 'WO - Auto Test');

            // Wait for the WO Asset input to be visible
            await this.page.waitForSelector(this.woAsset, { state: 'visible' });
            await this.page.waitForTimeout(500);

            // Try both inputs if needed        
            const woAssetInput = this.page.locator(this.woAsset).nth(2);
            await woAssetInput.click();
            await woAssetInput.fill('house');
            await this.page.waitForTimeout(500); // Wait for dropdown/autocomplete
            await woAssetInput.press('ArrowDown');
            await woAssetInput.press('Enter');                
             
            // Locate and click the "Create" button
            const createButton = this.page.locator('span.inline-block.text-center:has-text("Create")');
            await  createButton.click();
        } else { 
            console.log('New WO button is not visible'); 
        }
      }  else { 
            console.log('New WO button not found'); 
        }
    }

    /*
    ************************
    * Add Work Order Spare
    ************************
    */

    async addWOSpare(): Promise<void> {
        // Locate the "Work Order Header Title.png" element
        const woTitle = await this.page.$("span.inline-block.text-5\\.5.text-secondary:has-text('Work Order')");

        // Wait for the "Spares" tab and locate it
        var sparesTab = await this.page.waitForSelector("span.inline-block.sm\\:text-right.whitespace-pre:has-text('Spares')", { state: 'visible' });
        await sparesTab.click();

        // Close the browser
        await this.page.close();
    }    
}
