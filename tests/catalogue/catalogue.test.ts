import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { CataloguePage } from '../../pages/catalogoue/cataloguePage';

import createCatalogueData from '../../test-data/catalogue/createCatalogueData.json';


test.describe('Catalogue Module Tests', () => {
    let loginPage: LoginPage;
    let cataloguePage: CataloguePage;
    
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        cataloguePage = new CataloguePage(page);
        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
    });

    /*
    * Test Case: Create New Catalogue
    * This test creates a new Catalogue using the data from createCatalogueData.json 
    * Preconditions: User is logged in and createWorkOrderData.json is available
    * Steps:
    * 1. Open Catalogue Listing
    * 2. Click New button
    * 3. Enter Number, Description (Part Name), Stock On Hand, and Unit Price
    * Expected Result: New Catalogue created successfully and appears in the Catalogue Listing
    * Custom tags: @smoke
    */    
    test('Create New Catalogue @smoke', async () => {
        await cataloguePage.createCatalogue(createCatalogueData.catalogueNumber, createCatalogueData.partName, createCatalogueData.StockOnHand, createCatalogueData.UnitPrice);
        });
});