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
                console.log('WO icon clicked');
            
                // Locate the "Work Order Listing" element 
                const woListingHeader = await this.page.getByText('Work Order Listing');
                await expect(woListingHeader).toBeVisible();
            } else {
            console.log('Main Menu WO icon not found');
            }
        }
    }

    private woDesc = 'textarea#Description';
    private woAsset = '#main-content > article > div > div.fixed.top-\\[32px\\].left-0.bottom-0.right-0.flex.flex-col.items-center.justify-center.text-primary > div.relative.flex.flex-col.border.border-alternate.bg-secondary.max-w-\\[95\\%\\].max-h-\\[95\\%\\].shadow-xl.dark\\:shadow-black > div > div.flex-1.overflow-auto > div > div > div > div.bg-secondary.grid.grid-cols-\\[auto_1fr\\].gap-2.p-4 > div:nth-child(6) > div > div > div > div.grid.grow > div > div > div > input';

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
            await this.page.fill(this.woDesc, 'WO - Auto Test 4');

            // Ensure the woAsset input is visible and interactable
            await this.page.waitForSelector(this.woAsset, { state: 'visible' });
            await this.page.waitForTimeout(500); // Additional wait to ensure stability

                // Retry mechanism for filling the woAsset input
                for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                        await this.page.fill(this.woAsset, 'Auto Test 1');
                        await this.page.waitForTimeout(500); // Wait to ensure the input is populated

                        // Press Arrow Down and Enter keys
                        const woAssetInput = await this.page.$(this.woAsset);
                        if (woAssetInput !== null) {
                            await woAssetInput.press('ArrowDown');
                            await woAssetInput.press('Enter');
                            console.log('Arrow Down and Enter keys pressed');
                        } else {
                            console.log('WO Asset input not found');
                        }
                        break; // Exit the loop if successful
                    } catch (error) {
                        console.log(`Attempt ${attempt + 1} failed: ${error}`);
                        if (attempt === 2) throw error; // Rethrow after final attempt
                    }
                }

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
}
