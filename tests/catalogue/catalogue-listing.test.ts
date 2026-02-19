import { test } from '../fixtures'

/*
   * Reference ID: Test Case: Catalogue Listing should open successfully
   * Preconditions: User is logged in
   * Steps:
   * 1. Open Stores Menu
   * 2. Open Catalogue Listing
   * Expected Result: Catalogue Listing loads without errors
   * Custom tags: @smoke @Catalogue
 */

test('Open Catalogue Listing @smoke @feature-catalogue', async ({ cataloguePage }) => {
        console.log('🧪 Starting test: Open Stores Menu and then open Catalogue Listing');
        await cataloguePage.openStoresMenu();
        await cataloguePage.openCatalogueModule();
});