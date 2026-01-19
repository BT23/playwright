import { test } from '../fixtures';

    /*
    * Test Case: Create New Request and then create a Work Order with Asset
    * Preconditions: User is logged in and createRequestData.json is available. Fixture data used.
    * Steps:
    * 1. Open Requests Module
    * 2. Click 'New' button
    * 3. Enter Job Description and Asset
    * 4. Click Create button
    * 5. Click Approve button
    * 6. Click 'Create WO' button
    * 7. Verify that the Work Order is created successfully
    * 8. Verify that the Request Number is displayed in the Work Order Details
    * 9. Verify that the Requester value in WO Details matches the Requested By value in Request Details
    * Expected Result: WO created successfully. Request Number appears in WO Details. Requester matches Requested By.
    * Returns: N/A
    * Custom tags: @smoke @feature-request
    */ 
test('Create Request WO using fixture data @smoke @feature-request', async ({ woPage, requestPage, requestTestData }) => {        
        // Create a new Request and capture the number instead of reading from file (as request number does not exist when running the worker in parallel)
        const rawRequestNumber = await requestPage.createRequest(requestTestData.createrequest.jobDesc, requestTestData.createrequest.assetNumber);
        console.log(`Created Request Number: ${rawRequestNumber}`);
        
        // Ensure we have a value and trim it
        const requestNumber = rawRequestNumber?.trim() ?? null;
        console.log(`Trimmed Request Number: ${requestNumber}`);
        await requestPage.approveRequestAndClickOK();
        await requestPage.verifyRequestStatusEqualApprovedInDetailsForm("Approved");
        const requester = await requestPage.createRequestWorkOrder();
        await woPage.verifyWORequester(requester!);
        await woPage.verifyWORequestNumber(requestNumber!); 
});