import { expect, Page } from '@playwright/test';

export class AssetPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /*
    *********************
    *********************
    */

    async openAssetModule(): Promise<void> {
        // Locate the "Assets.png" element
        const assetsImage = await this.page.$('img[src="/_content/Mex.Blazor/images/Assets.png"]');

        // Verify and click the "Assets.png" element
        if (assetsImage !== null) {
            const isVisible = await assetsImage.isVisible();
            if (isVisible) {
            console.log('Main Menu Assets icon is visible');
            await this.page.waitForTimeout(1000);
            await assetsImage.click();
            console.log('Assets element clicked');

            // Wait for the "Asset Register" element to be visible 
            await this.page.waitForSelector('div[control-name="AssetRegisterHeader"] span.text-secondary', { state: 'visible' });
         
            // Locate the "Asset Register" element 
            const assetRegisterHeader = await this.page.$('div[control-name="AssetRegisterHeader"] span.text-secondary');
            
            if (assetRegisterHeader !== null){
                const assetHeaderisVisible = await assetRegisterHeader.isVisible();
                if (assetHeaderisVisible){
                    console.log('Asset Register opened');
                    await this.page.waitForTimeout(1000);
                }
                else
                    console.log('Asset Register Header is NOT visible');
            }
            } else {
            console.log('Assets element is not visible');
            }
       
        } else {
            console.log('Main Menu Assets icon not found');
        }
    }

    /*
    ************************
    * Create New Asset Test
    * **********************
    */
    private assetNumber = '#Number';
    private assetDesc = 'textarea#Description';

    async createNewAsset(): Promise<void> {
        await this.openAssetModule();
      
        const newLevel1Button = this.page.locator('div.cursor-pointer:has-text("New Level 1")');
        await newLevel1Button.waitFor({ state: 'visible' });
        await newLevel1Button.click();

        //Fill in the asset details
        await this.page.fill(this.assetNumber, 'Auto Test 3');
        await this.page.waitForTimeout(1000);
        await this.page.fill(this.assetDesc, 'Playwright Auto Test 3');
        
        // Locate and click the "Create" button
        const createButton = this.page.locator('span.inline-block.text-center:has-text("Create")');
        await createButton.click();
    }
}

