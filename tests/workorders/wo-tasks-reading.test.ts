import { test } from '../fixtures'

    /*
    * GitHub Issue ID: 3385 Work Order - Work Order Task - New Work Order Task Reading Value Record "Cannot Be Found"
    * Preconditions: User is logged in and createWorkOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open WO Module
    * 2. Click New button
    * 3. Enter Description and Asset
    * 4. Click Create button
    * 5. Click Tasks tab
    * 6. Click Add Task button
    * 7. Enter Task Description and Task Type
    * 8. Close the WO into History
    * 9. Click Tasks tab
    * 10. Enter Completed Date
    * 11. Enter Task Reading
    * 12. Click Back button to save and return to WO Listing
    * 13. Open Hiistory Listing
    * 14. Locate the WO created and click to Details
    * 15. Click Tasks tab
    * 16. Verify that the task reading retained and is displayed correctly
    * Expected Result: WO created successfully and appears in the WO Listing
    * Returns: WO Number and saves to woTempData.json
    * Custom tags: @regression @feature-wo
    */ 

test('Create WO Task Reading using fixture data @regression @feature-wo', async ({ woPage, woTestData, woDataFilePath  }) => {
    console.log('🧪 Starting test: Create new WO Task Reading using fixture data');
    await woPage.goto(); // Open WO Module
    await woPage.createWO(woTestData.createwo.caseWOTask.Asset, woTestData.createwo.caseWOTask.Description, woDataFilePath);
    await woPage.clickTasksTab(); // Click Tasks tab
    await woPage.addWOTask(woTestData.createwo.caseWOTask.TaskDescription, woTestData.createwo.caseWOTask.TaskType);
    await woPage.enterTaskReadingType(woTestData.createwo.caseWOTask.TaskType);
    await woPage.clickCloseWOBtn();
    await woPage.clickTasksTab(); // Click Tasks tab in History WO
    await woPage.enterCompletedDate(woTestData.createwo.caseWOTask.CompletedDate);
    await woPage.enterTaskReading(woTestData.createwo.caseWOTask.TaskReading);
    await woPage.clickBackBtn(); // Save and Back
});