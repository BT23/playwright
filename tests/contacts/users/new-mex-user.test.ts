import { test } from '../../fixtures'

    /*
    * Test Case: Create new MEX user
    * Preconditions: User is logged in. Fixture data used.
    * Steps:
    * 1. Open Settings Module
    * 2. Open Users Listing
    * 3. Click New Button
    * 4. Fill in required details and click Create
    * 5. Click Back button to return to Users Listing
    * Expected Result: Users Listing should open
    * Custom tags: @smoke @feature-users
    */    
    
    test('Create new mex user @smoke @feature-users', async ({ usersPage, usersTestData }) => {
        console.log('🧪 Starting test: Create new MEX Ops user');
        await usersPage.openUsersListing(); // Navigate to Users Listing
        await usersPage.createNewUser(usersTestData.createusers.CaseNewMEXUser.FirstName, usersTestData.createusers.CaseNewMEXUser.LastName, usersTestData.createusers.CaseNewMEXUser.UserName, usersTestData.createusers.CaseNewMEXUser.Type, usersTestData.createusers.CaseNewMEXUser.Password, usersTestData.createusers.CaseNewMEXUser.ConfirmPassword);
        await usersPage.clickBackBtn();
        await usersPage.verifytUserCreated(usersTestData.createusers.CaseNewMEXUser.UserName); // Verify new mex user created and appears in listing
        console.log('✅ Test completed: New MEX User created successfully');        
    });