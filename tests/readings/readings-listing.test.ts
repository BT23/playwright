import { test } from '../fixtures';

    /*
    * Reference ID: Test Case: Asset Readings should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Readings Module
    * 2. Verfiy that the Asset Readings header is displayed
    * Expected Result: Asset Readings loads without errors
    * Custom tags: @smoke @feature-readings
    */
    test('Open Readings Module @smoke @feature-readings', async ({ readingPage}) => {
        await readingPage.openReadingsModule();
    });
