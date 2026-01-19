import { request } from 'http';
import { test } from '../fixtures';

    /*
    * Test Case: Request Details - Approve a new request with asset successfully
    * Preconditions: User is logged in and createRequestData.json is available. Fixture data used.
    * Steps:
    * 1. Open Requests Module
    * 2. Click 'New' button
    * 3. Enter Job Description and Asset
    * 4. Click Create button
    * 5. Click Approve button and confirm
    * 6. Verify Request Status is 'Approved'
    * 6. Click Back button to return to Request Listing
    * 7. Verify Request appears in the Request Listing with status 'Approved'
    * Expected Result: Request created and approved successfully and appears in the Request Listing
    * Returns: N/A
    * Custom tags: @smoke @feature-request
    */ 

test('Request Details - Approve new request with asset using fixture data @smoke @feature-request', async ({ requestPage, requestTestData }) => {        
        // Create a new Request and capture the number instead of reading from file (as request number does not exist when running the worker in parallel)
        const rawRequestNumber = await requestPage.createRequest(requestTestData.createrequest.jobDesc, requestTestData.createrequest.assetNumber);
        console.log(`Created Request Number: ${rawRequestNumber}`);
        
        // Ensure we have a value and trim it
        const requestNumber = rawRequestNumber?.trim() ?? null;
        console.log(`Trimmed Request Number: ${requestNumber}`);
        await requestPage.approveRequestAndClickOK();
        await requestPage.verifyRequestStatusEqualApprovedInDetailsForm("Approved");
        await requestPage.clickBackBtn();
        await requestPage.selectSpecificedRequest(requestNumber!);
        await requestPage.verifyRequestStatusEqualApprovedOnListing(requestNumber!, "Approved");
});