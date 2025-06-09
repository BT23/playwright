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
        await this.openWOModule();

        // Wait for any data row to be visible
        //await this.page.locator('tr.row').first().waitFor({ state: 'visible' });

        // Option 1: Click the first data row
        //await this.page.locator('tr.row').first().click();

        // Wait for any data row to be visible
        await this.page.locator('tr.row').first().waitFor({ state: 'visible' });

        // Click the row containing the actual text you want
        await this.page.locator('tr.row:has-text("apples")').first().click();

        // Wait for the Details button (image) to be visible and click it
        const detailsButton = this.page.locator('img[src="/_content/Mex.Blazor/images/Details.png"]');
        await detailsButton.waitFor({ state: 'visible' });
        await detailsButton.click();

        // Wait for the Spares tab to be visible
        const sparesTab = this.page.locator('span.inline-block.whitespace-pre', { hasText: 'Spares' });
        await sparesTab.waitFor({ state: 'visible' });

        // Click the Spares tab
        await sparesTab.click();

       // Wait for the Add button to be visible
        const addButton = this.page.locator('div#Add:has-text("Add")');
        await addButton.waitFor({ state: 'visible' });

        // Click the Add button
        await addButton.click();        

        // Wait for the last row (the newly added row) to appear
        const newRow = this.page.locator('tr.row').last();

        /*
        * Enter Catalogue item
        */

        // Wait for the first editable cell in the new row to be visible
        const firstCell = newRow.locator('td.grid-cell:not(.readonly):not(.disabled)').first();
        await firstCell.waitFor({ state: 'visible' });

        // Click the first cell
        await firstCell.click();

        // Wait for the input to appear inside the cell
        const cellInput = firstCell.locator('input');
        await cellInput.waitFor({ state: 'visible' });

        // Fill in the value
        await cellInput.fill('Plush Pluto');

        // Wait for the dropdown option to appear and select it
        const dropdownOption = this.page.locator('label.my-auto', { hasText: 'Plush Pluto Rope Ball' });
        await dropdownOption.waitFor({ state: 'visible' });
        await dropdownOption.click();

        // Tab off the field
        await cellInput.press('Tab');

        /*
        * Enter Estimated Quantity
        */

        // Find the cell with the input (adjust nth if needed)
        const estQtyCell = newRow.locator('td.grid-cell').nth(3); // or use the correct index if not the first

        // Click the cell to activate the input (if needed)
        await estQtyCell.click();

        // Locate the input by class (since type is empty)
        const estQtyInput = estQtyCell.locator('input.h-8.outline-none.w-full.h-\\[30px\\]').first();
        await estQtyInput.waitFor({ state: 'visible' });

        // Fill in "2"
        await estQtyInput.fill('2');
        await estQtyInput.press('Tab');

        /*
        * Close WO Details form
        */
        // Wait for any visible mex close button with × and click it
        const closeButton = this.page.locator('button.mex-close-button:visible', { hasText: '×' }).first();
        await closeButton.waitFor({ state: 'visible', timeout: 10000 });
        await closeButton.click();
    }    
}
