import { test } from '../fixtures'

    /*
    * Test Case: Create New Parent Asset successfully
    * Preconditions: User is logged in and createWorkOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open Assets Module
    * 2. Click 'New Level 1' button
    * 3. Enter Description and Asset
    * 4. Click Create button
    * Expected Result: Level 1 created successfully and appears in the Asset Register
    * Returns: N/A
    * Custom tags: @smoke @feature-asset
    */ 

test('Fill in Asset Details Extended tab using fixture data @smoke @feature-asset', async ({ assetPage, assetTestData }) => { 
    console.log('🧪 Starting test: Create new level 1 asset using fixture data');
});

