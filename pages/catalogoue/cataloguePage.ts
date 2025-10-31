import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class CataloguePage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

    /*
    ************************
    * Open Catalogue Module
    ************************
    */
    async openCatalogueModule(): Promise<void> {
        // Check if the "Stores" button is visible
        const storesButton = this.page.locator('[automation-button="Stores"]');
        if (!(await storesButton.isVisible())) {
            await helper.addModuleToMenu("Stores");
            await this.page.waitForTimeout(1000);
        }

        // Click on Stores button to open the Stores menu
        await helper.clickButton("Stores");

        // Click on Stores button to open the Stores menu
        await helper.clickButton("Catalogue");
        
        // Verify that the Work Order Listing header is displayed
        await helper.checkHeader("CatalogueListingHeader");
    
        await this.page.waitForTimeout(1000);
    }

     /*
    **********************
    * Create Catalogue
    **********************
    */
    async createCatalogue(catalogueNumber: string, partName:string, soh:string, cost:string): Promise<void> {
        await this.openCatalogueModule();

        await helper.clickButton("New");
        await this.page.waitForTimeout(1000);

        await helper.enterValueInDialog("CreateCatalogue","Number",catalogueNumber);
        await this.page.waitForTimeout(1000);

        await helper.enterValueInDialog("CreateCatalogue","Description",partName);
        await this.page.waitForTimeout(1000);

        await helper.enterValueInDialog("CreateCatalogue","StockonHand",soh);
        await this.page.waitForTimeout(1000);

        await helper.enterValueInDialog("CreateCatalogue","UnitPrice",cost);
        await this.page.waitForTimeout(1000);    

        // Click the Create button to save the new Work Order
        await helper.clickButtonInDialog("CreateCatalogue", "Create");

        await this.page.waitForTimeout(1000);
    }   

    /*
    ************************
    * Add Supplier
    ************************
    */
    async addSupplier(): Promise<void> {
        await helper.selectTab("SuppliersTab");
        //await helper.clickButton();
    }

}