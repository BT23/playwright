
import { test } from '../fixtures'

/*
   * Reference ID: Test Case: PO Listing should open successfully
   * Preconditions: User is logged in
   * Steps:
   * 1. Open Stores Menu
   * 2. Open Purchse Order Listing
   * Expected Result: Purchase Order Listing loads without errors
   * Custom tags: @smoke @PO
 */

test('Open PO lising @smoke @feature-po', async ({ poPage }) => {
        console.log('🧪 Starting test: Open Stores Menu and then open PO Listing');
        await poPage.openStoresMenu();
        await poPage.openPOModule();
});