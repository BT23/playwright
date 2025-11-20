import { test } from '../fixtures';

    /*
    * Reference ID: Test Case: Asset Module should open successfully
    * Preconditions: User is logged in
    * Steps:
    * 1. Open Asset Register
    * 2. Verfiy that the Asset Register header is displayed
    * Expected Result: Asset Register loads without errors
    * Custom tags: @smoke
    */
test('Create new level 1 asset using fixture data @smoke @feature-asset', async ({ assetPage }) => {
        await assetPage.openAssetModule();
    });