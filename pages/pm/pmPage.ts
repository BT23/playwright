import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';
import { writeFileSync } from 'fs';

export class PmPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }
    async goto() {
        await this.openPMModule();
    }
    /*
    *****************
    * Open PM Module
    *****************
    */
    async openPMModule(): Promise<void> {
        // Wait for element visibility using smart wait
        const navButton = this.page.locator('[automation-button="NavItemPreventative Maintenance"]');
        await navButton.waitFor({ state: 'visible', timeout: 10000 });
        
        // Click on the Work Orders button to open the Work Order module
        await helper.clickButton("NavItemPreventative Maintenance");

        // Wait for page to load after navigation
        await this.page.waitForLoadState('networkidle');

        // Verify header is displayed
        const header = this.page.locator('[automation-header="PreventativeMaintenanceListingHeader"] span', { hasText: 'Preventative Maintenance Listing' }).first();
        await header.waitFor({ state: 'visible', timeout: 10000 });
    }

    /*************
    * Open New PM
    **************
    */
    async createPM(pmDesc:string, pmFrequency: string, pmFrequencyType: string, filePath?: string): Promise<string|null> {
        // Click the New button to create a new PM
        await helper.clickButton("NewPM");

        // Enter PM Description
        await helper.enterValueInDialog("CreatePreventativeMaintenance", "Description", pmDesc);
        await this.page.waitForTimeout(1000);

        // Enter PM Frequency
        await helper.enterValueInDialog("CreatePreventativeMaintenance", "Frequency", pmFrequency);
        await this.page.waitForTimeout(1000);        
        
        // Enter PM Frequency Type
        const freqTypeShortName = pmFrequencyType.trim().substring(0, 2);
        await helper.enterValueInDialog("CreatePreventativeMaintenance", "FrequencyType", freqTypeShortName);
        await this.openFrequencyTypeDropdown();
        await this.selectFirstListItemFromList();
        await this.page.waitForTimeout(1000);

        // Click the Create button to save the new Purchase Order
        await helper.clickButton("Create");

        // Wait until the WO Header is visible before clicking
        const woHeader = this.page.locator('[automation-header="PolicyHeader"]');
        await woHeader.waitFor({ state: 'visible', timeout: 10000 });        

        // Wait until the Asset button is visible
        const assetLabel = this.page.locator('[automation-button="Duplicate"]');
        await assetLabel.waitFor({ state: 'visible', timeout: 10000 });    

        // Locate the element using its class
        const pmElement = await this.page.locator('div.ml-2.text-5\\.5.text-secondary');
        // Get the text content
        const pmNumber = await pmElement.textContent();
        console.log('Preventative Maintenance Number:', pmNumber?.trim());

        // Write the PM number to a JSON file if filePath is provided in fixtures.ts
        if (filePath) {
            // Save
            writeFileSync(filePath, JSON.stringify({ pmNumber }, null, 2));
        }        
        return pmNumber?.trim() ?? null;    
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

    private async openFrequencyTypeDropdown(): Promise<void> {
        const input = this.page.locator('[automation-input="FrequencyType"]');
        await expect(input).toBeVisible({ timeout: 5000 });
        await input.click({ force: true });
        await this.page.waitForTimeout(300);
    }

    private async selectFirstListItemFromList(): Promise<void> {
        const item = this.page.locator('[automation-list-item]').first();
        await item.waitFor({ state: 'visible', timeout: 10000 });
        await item.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(150);

        try {
            await item.click({ timeout: 10000 });
        } catch (error: any) {
            const message = error?.message ?? '';
            if (/intercept.*pointer/i.test(message)) {
                await item.click({ force: true, timeout: 10000 });
                return;
            }
            throw error;
        }
    }

    /*
    ************************
    * Enter Lead Time
    ************************
    */    
  async enterLeadTime(leadTime: string): Promise<void> {
        // Enter Lead Time
        await helper.enterValue("LeadTime", leadTime);
        await this.page.waitForTimeout(1000);
  }
}