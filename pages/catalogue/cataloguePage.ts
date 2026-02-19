import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class CataloguePage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }

     async goto() {
        await this.openStoresMenu();
        await this.openCatalogueModule();
    }     

    /*
    ************************
    * Open Catalogue Module
    ************************
    */
     async openStoresMenu(): Promise<void> {
        // Wait for the Purchasing button to become visible
        await this.page.waitForSelector('[automation-button="NavItemStores"]', { state: 'visible', timeout: 5000 });        
        // Click on Stores button to open the Stores menu
        await helper.clickButton("NavItemStores");
    } 

    async openCatalogueModule(): Promise<void> {
        // Wait for the Purchasing button to become visible
        await this.page.waitForSelector('[automation-button="Catalogue"]', { state: 'visible', timeout: 5000 });

        // Click on Stores button to open the Stores menu
        await helper.clickButton("Catalogue");
        
        // Wait for the Catalogue Listing header to appear
        await this.page.waitForSelector('[automation-header="CatalogueListingHeader"] span', { state: 'visible', timeout: 5000 });        
    }

     /*
    **********************
    * Create Catalogue
    **********************
    */
    async createCatalogue(catalogueNumber: string, partName:string, soh:string, cost:string): Promise<void> {

        await helper.clickButton("New");

        const createCatalogueHeader = this.page.locator('[automation-header="CreateCatalogue"]');
        await createCatalogueHeader.waitFor({ state: 'visible', timeout: 5000 });

        await helper.enterValueInDialog("CreateCatalogue","Number",catalogueNumber);
        
        await helper.enterValueInDialog("CreateCatalogue","PartName",partName);
        
        await helper.enterValueInDialog("CreateCatalogue","StockonHand",soh);
        
        await helper.enterValueInDialog("CreateCatalogue","UnitPrice",cost);
        
        // Click the Create button to save the new Work Order
        await helper.clickButtonInDialog("CreateCatalogue", "Create");

        // Wait for dialog to close or next action to complete
        await this.page.waitForLoadState('domcontentloaded');  
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
    ************************
    * Add Supplier
    ************************
    */
    async addSupplier(): Promise<void> {
        await helper.selectTab("SuppliersTab");
        //await helper.clickButton();
    }

}