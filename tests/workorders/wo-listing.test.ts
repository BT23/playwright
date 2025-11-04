import { test } from '../fixtures'

/*
   * Reference ID: Test Case: WO Listing should open successfully
   * Preconditions: User is logged in
   * Steps:
   * 1. Open WO Listing
   * Expected Result: Work Order Listing loads without errors
   * Custom tags: @smoke @feature-wo
 */

test('Open PO lising @smoke @feature-po', async ({ woPage }) => {
        await woPage.openWOModule();
});