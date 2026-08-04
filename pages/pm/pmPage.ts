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
        
        // Click on the PM button to open the PM module
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
        console.log('📝 Preventative Maintenance Number:', pmNumber?.trim());

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

    /*
    ***************************
    * Click Activator button
    ***************************
    */
    async clickActivatorBtn(): Promise<void> {
        await helper.clickButton("Activator");

        // Wait for page to load after navigation
        await this.page.waitForLoadState('networkidle');

        // Verify header is displayed
        const header = this.page.locator('[automation-header="ActivatorListingHeader"] span', { hasText: 'Activator Listing' }).first();
        await header.waitFor({ state: 'visible', timeout: 10000 });
    }

    /*
    ***************************
    * Click Raise WO button
    ***************************
    */
    async clickRaiseWOBtn(): Promise<string | null> {
        const raiseWOAutomationButton = this.page.locator('[automation-button="RaiseWorkOrder"]').first();
        const useAutomationButton = await raiseWOAutomationButton.count() > 0;
        const raiseWOButton = useAutomationButton
            ? raiseWOAutomationButton
            : this.page.getByRole('button', { name: 'Raise Work Order' }).first();

        await raiseWOButton.waitFor({ state: 'visible', timeout: 10000 });
        await raiseWOButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await raiseWOButton.click({ force: true });

        // Wait for the View Details dialog to appear (with a reasonable timeout)
        // Use the dialog container if available; if not, use header then parent or a known container.
        const viewDetailsDialog = this.page.locator('[automation-dialog="ViewDetails"]');
        const dialogVisible = await viewDetailsDialog.waitFor({ state: 'visible', timeout: 3000 })
        .then(() => true)
        .catch(() => false);

        let workOrderNumber: string | null = null;
        if (dialogVisible) {
            const dialogText = await viewDetailsDialog.textContent();
            if (dialogText) {
                const match = dialogText.match(/Work\s*Order\s*Number[^0-9]*(\d+)/i);
                workOrderNumber = match?.[1] ?? null;
            }

            let noButton = viewDetailsDialog.locator('[automation-button="No"]').first();
            if (await noButton.count() === 0) {
                noButton = viewDetailsDialog.getByRole('button', { name: 'No' }).first();
            }
            if (await noButton.count() === 0) {
                noButton = viewDetailsDialog.getByText('No').first();
            }

            const noButtonExists = await noButton.count() > 0;
            if (!noButtonExists) {
                throw new Error('Unable to locate the No button in the View Details dialog');
            }

            await noButton.waitFor({ state: 'visible', timeout: 10000 });
            await noButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);

            const clickNo = async (): Promise<boolean> => {
                try {
                    await noButton.click({ force: true });
                    return true;
                } catch {
                    return false;
                }
            };

            const clickedOnce = await clickNo();
            await this.page.waitForTimeout(300);

            let dialogClosed = await viewDetailsDialog.waitFor({ state: 'hidden', timeout: 2000 })
                .then(() => true)
                .catch(() => false);

            if (!dialogClosed) {
                if (!clickedOnce) {
                    const handle = await noButton.elementHandle();
                    if (handle) {
                        await this.page.evaluate(el => (el as HTMLElement).click(), handle);
                    }
                }

                await this.page.waitForTimeout(200);
                await this.page.keyboard.press('Enter').catch(() => {});

                dialogClosed = await viewDetailsDialog.waitFor({ state: 'hidden', timeout: 5000 })
                    .then(() => true)
                    .catch(() => false);
            }

            if (!dialogClosed) {
                throw new Error('View Details dialog did not close after clicking No');
            }
        }

        return workOrderNumber;
    }

    /*
    *********************************
    * openFrequencyTypeDropdown method is used in the createPM method.
    * It is different from the openFrequencyTypeDropdown method in the helperMethods.ts file
    *********************************
    */
    private async openFrequencyTypeDropdown(): Promise<void> {
        const input = this.page.locator('[automation-input="FrequencyType"]');
        await expect(input).toBeVisible({ timeout: 5000 });
        await input.click({ force: true });
        await this.page.waitForTimeout(300);
    }

    /*
    *********************************
    * selectFirstListItemFromList method is used in the createPM method.
    * It is different from the selectFirstListItemFromList method in the helperMethods.ts file
    *********************************
    */

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

   /*
    ************************
    * PM Assets Tab
    ************************
    */

    /*
    ************************
    * Add PM Asset
    ************************
    */

    async addPMAsset(assetNumber: string): Promise<void> {
        const woHeader = this.page.locator('[automation-header="PolicyHeader"]');
        await woHeader.waitFor({ state: 'visible', timeout: 5000 });

        // Wait until the AssetsTab button is visible before clicking
        const itemsTab = this.page.locator('[automation-tab="AssetsTab"]');
        await itemsTab.waitFor({ state: 'visible', timeout: 5000 });

        await helper.selectTab("AssetsTab");

        const addBtn = this.page.locator('[automation-button="Add"]');
        await addBtn.waitFor({ state: 'visible', timeout: 5000 });

        await helper.clickButton("Add");

        /*
        * Enter Asset
        */
        const newRow = await helper.selectLastRow("AssetsTabGrid");
        await helper.enterValueInCell(newRow, "Asset", assetNumber);
        await helper.selectFirstListItem();
        await this.page.waitForTimeout(1000);
        const field = this.page.locator('[automation-input="Asset"]');
        await field.press('Tab');
        await this.page.waitForTimeout(1000);
    }        

    /*
    *********************************
    * PM/Activator Listing Operations
    *********************************
    */

    /*
    ***************************
    * Open Specified Opened PM
    ***************************
    */
    async selectSpecificedPM(pmNumber: string): Promise<void> {
        await helper.selectRowByFieldName("ActivatorListingGrid", "PMNumber", pmNumber.trim());
        await this.page.waitForTimeout(1000);
    }

    /*
    ***************************
    * Enter Specified Opened PM
    ***************************
    */
    async enterActivatorDaysinAdvance(DaysinAdvance: string): Promise<void> {
        const input = this.page.locator('[automation-input="DaysinAdvance"]');
        await expect(input).toBeVisible({ timeout: 5000 });
        await input.click({ force: true });
        await helper.enterValue("DaysinAdvance", DaysinAdvance);
        await this.page.waitForTimeout(300);
    }    

}