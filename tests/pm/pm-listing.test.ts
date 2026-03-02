import { test } from '../fixtures';
    /*
    * Reference ID: Test Case: PM Module should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Preventative Maintenance 
    * 2. Verfiy that the PM header is displayed
    * Expected Result: PM loads without errors
    * Custom tags: @smoke @feature-pm
    */
    test('Open PM Module @smoke @feature-pm', async ({ pmPage }) => {
        console.log("📝 Starting test: Open PM Module");
        await pmPage.openPMModule();
    });