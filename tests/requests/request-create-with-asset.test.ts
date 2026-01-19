import { test } from '../fixtures';

    /*
    * Test Case: Create New Request with Assest Successfully
    * Preconditions: User is logged in and createRequestData.json is available. Fixture data used.
    * Steps:
    * 1. Open Requests Module
    * 2. Click 'New' button
    * 3. Enter Job Description and Asset
    * 4. Click Create button
    * Expected Result: Request created successfully
    * Returns: N/A
    * Custom tags: @smoke @feature-request
    */ 

test('Create new request with asset using fixture data @smoke @feature-request', async ({ requestPage, requestTestData }) => {
        await requestPage.openRequestsModule();
        await requestPage.createRequest(requestTestData.createrequest.jobDesc, requestTestData.createrequest.assetNumber);
        await requestPage.clickBackBtn();
});