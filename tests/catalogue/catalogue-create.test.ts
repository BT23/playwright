import { test } from '../fixtures';

    /*
    * Test Case: Create New Catalogue
    * This test creates a new Catalogue using the data from createCatalogueData.json 
    * Preconditions: User is logged in and createWorkOrderData.json is available
    * Steps:
    * 1. Open Catalogue Listing
    * 2. Click New button
    * 3. Enter Number, Description (Part Name), Stock On Hand, and Unit Price
    * Expected Result: New Catalogue created successfully and appears in the Catalogue Listing
    * Custom tags: @smoke @feature-catalogue
    */    

    test('Create new catalogue using fixture data @smoke @feature-catalogue', async ({ cataloguePage, catalogueTestData }) => {
        console.log('🧪 Starting test: Create new catalogue using fixture data');
        await cataloguePage.goto();
        await cataloguePage.createCatalogue(
            catalogueTestData.createcatalogue.catalogueNumber, 
            catalogueTestData.createcatalogue.partName, 
            catalogueTestData.createcatalogue.StockOnHand, 
            catalogueTestData.createcatalogue.UnitPrice
        );
        await cataloguePage.clickBackBtn();
    });

